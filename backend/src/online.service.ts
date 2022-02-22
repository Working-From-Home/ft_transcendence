import { Injectable, Scope } from '@nestjs/common';
import { Socket } from 'dgram';
import { AppGateway } from './app.gateway';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/services/users.service';

@Injectable()
export class OnlineService {
  private userIds: number[] = [];

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  addUser(userId: number) {
      this.userIds.push(userId);
	}
  // need to fix it. What we do then ? one socket per client or multiple per client ?
  removeUser(userId: number) {
    this.userIds = this.userIds.filter((id) => id !== userId);
  }

  getOnlineUsers(): number[]
  {
    return this.userIds
  }

  // for now, is more about the number of socket connexions than the actual number of users online...
  getTotalOnlineUsers(): number
  {
    return this.userIds.length;
  }

  isOnline(userId: number): boolean {
    return this.userIds.find((id) => id === userId) !== null;
  }
}
