import { Injectable, Scope } from '@nestjs/common';
import { Socket } from 'dgram';
import { AppGateway } from './app.gateway';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/services/users.service';

@Injectable()
export class OnlineService {
  private userIds: number[] = [];
	private idsAndCount : Map<number, number>;

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {
		this.idsAndCount = new Map<number, number>();
	}

  addUser(userId: number) {
			if (this.userIds.includes(userId)) {
				this.idsAndCount[userId] += 1;
			} else { 
      	this.userIds.push(userId);
				this.idsAndCount[userId] = 1;
			}
	}
  removeUser(userId: number) {
		if (!this.userIds.includes(userId))
			return ;
		this.idsAndCount[userId] -= 1;
		if (this.idsAndCount[userId] === 0)
    	this.userIds = this.userIds.filter((id) => id !== userId);
  }

  getOnlineUsers(): number[]
  {
    return this.userIds
  }

  getTotalOnlineUsers(): number
  {
    return this.userIds.length;
  }

  isOnline(userId: number): boolean {
    return this.userIds.find((id) => id === userId) !== null;
  }
}
