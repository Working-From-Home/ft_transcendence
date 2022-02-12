import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { VerifyCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(readonly config: ConfigService) {
    super({
      clientID: config.get<string>('FORTY_TWO_CLIENT_ID'),
      clientSecret: config.get<string>('FORTY_TWO_SECRET'),
      callbackURL: config.get<string>('BACKEND_SERVER_URI') + '/auth/42/callback',
      scope: ['public']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // done: VerifyCallback,
  ): Promise<any> {
		const {name, email, photo} = profile
		const user = {
			username:name,
			email: email,
			
		}
    console.log(profile)
	}
}
