import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export default class JwtTwoFaGuard extends AuthGuard('jwt-two-fa') {}