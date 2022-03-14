import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallblack} from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(readonly config: ConfigService) {
    super({
      clientID: config.get<string>('FORTY_TWO_CLIENT_ID'),
      clientSecret: config.get<string>('FORTY_TWO_SECRET'),
      callbackURL: config.get<string>('OAUTH_REDIRECT_URI'),
      scope: ['public']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallblack,
  ): Promise<any> {
		const {id, emails, username, photos } = profile
    const user = {
      sub: id,
      email: emails[0].value,
			username: username,
      picture: photos[0].value,
      accessToken,
      refreshToken,
		}
    done(null, user);
	}
}
