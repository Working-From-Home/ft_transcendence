import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { getManager, FindManyOptions, Repository } from 'typeorm'
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from '../entities/user.entity';
import { AvatarService } from './avatar.service';
import { StatsService } from './stats.service';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        private readonly avatarService: AvatarService,
        private readonly statsService: StatsService
    ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.repo.create(user);
    if (!newUser.username)
      newUser.username = await this.generateUsername();
    await this.repo.save(newUser);
    await this.avatarService.create(newUser);
    await this.statsService.create(newUser); 
    return newUser;
  }

    async generateUsername(): Promise<string> {
      return uniqueNamesGenerator({ dictionaries: [adjectives, colors] });
    }

    async update(id: number, attrs: Partial<User>) {
      // const user = await this.repo.findOne({ where: { id }});
      // const maxMinutesEdit = 1;
      // const maxDate = new Date(new Date().getTime() + maxMinutesEdit*60000);
      // if (attrs.username && user.createdAt > maxDate)
      //   throw new UnauthorizedException(`Can't modify username after ${maxMinutesEdit} minutes.`);
      await this.repo.update({id}, attrs);
      return attrs;
    }

    async remove(user: User): Promise<User> {
        return await this.repo.remove(user);
    }

    async findById(id: number): Promise<User> {
        const user = await this.repo.findOne({ where: { id }, relations: ['stats'] });
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }

    async findByIds(ids: number[]): Promise<User[]> {
        const users = await this.repo.findByIds(ids, { relations: ['stats'] });
        return users;
    }

    async findByEmail(email: string): Promise<User> {
        const users = await this.repo.find({ email });
        if (users.length === 0) { return null; }
        return users[0];
    }

    async findByName(username: string): Promise<User> {
        const users = await this.repo.find({ username });
        if (users.length === 0) { return null; }
        return users[0];
    }

  async findBy(options?: FindManyOptions<User>): Promise<User[]> {
    return await this.repo.find(options);
  }

  async countBy(options?: FindManyOptions<User>): Promise<number> {
    return await this.repo.count(options);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
      const queryBuilder = this.repo.createQueryBuilder('user');
      queryBuilder.orderBy('user.id', 'ASC');
      return paginate<User>(queryBuilder, options);
  }

  async getUserWithAvatar(id: number): Promise<User> {
      const user = await this.repo.findOne(id, { relations: ["avatar"] });
      if (!user) { throw new NotFoundException('user not found'); }
      return user;
  }

  async getUserWithStats(id: number): Promise<User> {
      const user = await this.repo.findOne(id, { relations: ["stats"] });
      if (!user) { throw new NotFoundException('user not found'); }
      return user;
  }
  async searchUsers(data: {title: string}) {
	const y = await getManager().connection.query(
		`SELECT u."id" AS "_id",
				u.username AS "username"
		FROM "user" u
		WHERE username LIKE ('%${data.title}%')`
	  );
	return y;
  }

	async setTwoFaSecret(secret: string, userId: number) {
		return this.repo.update(userId, { twoFaSecret: secret});
	}

	async turnOnTwoFa(userId : number) {
		return this.repo.update(userId, { twoFaEnabled : true});
	}
}
