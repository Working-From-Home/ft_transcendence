import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "src/users/services/users.service";
import { JwtPayload } from '../auth.service'


@Injectable()
export class JwtTwoFaStrategy extends PassportStrategy(Strategy, 'jwt-two-fa')
{
	constructor(
		private readonly config : ConfigService,
		private readonly userService : UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
		});
	}

	async validate(payload: JwtPayload) {
		const user = await this.userService.findById(payload.sub);
		if (!user.twoFaEnabled) {
			return { sub : payload.sub };
		}
		else if (payload.isTwoFaAuthenticated) {
			return { sub : payload.sub };
		}
	}
} 