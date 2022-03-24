import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { authenticator } from 'otplib';
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/services/users.service";
import { toFileStream } from 'qrcode'

@Injectable()
export class TwoFaService {
	constructor (
		private readonly usersService : UsersService,
		private readonly configService : ConfigService
	) {}

	public isTwoFaCodeValid(twoFaCode : string, user: User) {
		return authenticator.verify({
			token: twoFaCode,
			secret: user.twoFaSecret
		})
	}

	public async generateTwoFaSecret(user : User) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(user.email ,
			this.configService.get('TWO_FA_APP_NAME'), secret);

		console.log(secret);
		await this.usersService.setTwoFaSecret(secret, user.id);
		
		return { secret, otpauthUrl }
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl)
	}
}