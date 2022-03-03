import { Expose, Type} from "class-transformer";
import { ValidateNested } from "class-validator";
import { UserDto } from "src/users/dtos/user.dto";
import { User } from "src/users/entities/user.entity";
import { Game } from '../entities/game.entity'

class lightUserDto {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    role: string;
}

class lightGameDto {
    @Expose()
    id: number;

    @Expose()
    winnerScore: number;

    @Expose()
    looserScore: number;

    @Expose()
    createdAt: Date;

    @Type(() => lightUserDto)
    @Expose()
    winner: User;

    @Type(() => lightUserDto)
    @Expose()
    looser: User;
}

export class GamesPaginationDto {

    @ValidateNested({ each: true })
    @Type(() => lightGameDto)
    @Expose()
    items: Game[];

    @Expose()
    meta: JSON;

    @Expose()
    links: JSON;
}