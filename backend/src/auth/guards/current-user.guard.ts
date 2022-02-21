import { CanActivate, ExecutionContext, ForbiddenException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/services/users.service";


@Injectable()
export class CurrentUserGuard implements CanActivate {

    constructor(@Inject(forwardRef(() => UsersService)) private usersService: UsersService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const paramId: number = request.params.id;
        const currentUserId: number = request.user.sub;
        if (paramId != currentUserId) {
            throw new ForbiddenException('this is not your account!')
        }
        return true;
    }
}