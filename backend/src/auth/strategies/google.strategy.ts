import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(readonly config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_SECRET'),
      callbackURL: config.get<string>('OAUTH_REDIRECT_URI'),
      scope: ['openid', 'email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile
    const user = {
      sub: id,
      email: emails[0].value,
      firstName: name.givenName, // useless
      lastName: name.familyName, // useless
      picture: photos[0].value,
      accessToken,
      refreshToken,
    }
    done(null, user);
  }
}
