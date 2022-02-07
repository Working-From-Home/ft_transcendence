import { Injectable, Scope } from '@nestjs/common';
import { Socket } from 'dgram';
import { AppGateway } from './app.gateway';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/services/users.service';

interface ConnectedUser {
  id: number;
  // username: string;
  //	socket_ids?: string[];
};

@Injectable()
export class OnlineService {
  private users: ConnectedUser[] = [];

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  addUser(userId: number) {
      this.users.push({id : userId});
  }
    
  // need to fix it. What we do then ? one socket per client or multiple per client ?
  removeUser(userId: number) {
    this.users = this.users.filter((u) => u.id !== userId);
  }

  getOnlineUsers(): ConnectedUser[]
  {
    return this.users
  }

  // for now, is more about the number of socket connexions than the actual number of users online...
  getTotalOnlineUsers(): number
  {
    return this.users.length;
  }

  isOnline(userId: number): boolean {
    return this.users.find((u) => u.id === userId) !== null;
  }
}
