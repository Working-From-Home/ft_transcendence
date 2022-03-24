import { ClassSerializerInterceptor, Controller, Post, Req, Body, Res, UseGuards, UseInterceptors, UnauthorizedException, HttpCode } from "@nestjs/common";
import { Response } from "express";
import { request } from "http";
import { UsersService } from "src/users/services/users.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { TwoFaService } from "./twoFa.service";
import TwoFaCodeDto from "../dtos/twoFaCode.dto";
import { AuthService } from "../auth.service";


@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFaController {
	constructor(
		private readonly twoFaService : TwoFaService,
		private readonly usersService : UsersService,
		private readonly authService : AuthService,
	) {}

	@Post('turn-on')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async turOnTwoFa(@Req() request, @Body() { twoFaCode } : TwoFaCodeDto )
	{
		const user = await this.usersService.findById(parseInt(request.user.sub));
		const isCodeValid = this.twoFaService.isTwoFaCodeValid(twoFaCode, user);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentification code');
		}
		await this.usersService.turnOnTwoFa(user.id);
	}

	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async authenticate(@Req() request, @Body() { twoFaCode } : TwoFaCodeDto ) {
		const user = await this.usersService.findById(parseInt(request.user.sub));
		const isCodeValid = this.twoFaService.isTwoFaCodeValid(twoFaCode, user);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentification code');
		}
		console.log('cod valid! :)')
		return this.authService.generateAccessToken(user, true);

	}

	@Post('generate')
	@UseGuards(JwtAuthGuard)
	async register(@Res() response: Response, @Req() request) {
		const user = await this.usersService.findById(parseInt(request.user.sub));
		const { otpauthUrl } = await this.twoFaService.generateTwoFaSecret(user);

		response.set({ 'Content-Type': 'image/png'})
		return this.twoFaService.pipeQrCodeStream(response, otpauthUrl);
	}
}