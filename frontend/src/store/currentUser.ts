import { toNumber } from '@vue/shared';
import { defineStore } from 'pinia';

import UserService from '@/services/UserService';
import { IUser } from '@/models/IUser';
import axios, { AxiosError } from 'axios';
import { IError } from '@/models/IError';
import { IFriendLists } from '@/models/IFriendLists';

export interface State {
  userId: number | null;
  email: string;
  username: string;
  avatar: string;
  friendLists: IFriendLists;
}

export const useCurrentUserStore = defineStore('currentUser', {
  state: (): State => ({
    userId: null,
    username: '',
    email: '',
    avatar: '',
    friendLists: {
      friends: [],
      pendings: [],
      sent: []
    }
  }),
  getters: {
    isFriend : (state) => {
			return(id : number) => state.friendLists.friends.includes(id)
		},
    isPending : (state) => {
			return(id : number) => state.friendLists.pendings.includes(id)
		},
    isSent : (state) => {
			return(id : number) => state.friendLists.sent.includes(id)
		},
  },
  actions: {
    async initStore(myUserId: number) {
      try {
        const user = await UserService.getUserById(myUserId);
        const avatar = await UserService.getAvatarOfUser(myUserId);   
        const friends = await UserService.getFriendships(myUserId, "accepted");
        const pendings = await UserService.getFriendships(myUserId, "pending");
        const sent = await UserService.getFriendships(myUserId, "sent");
        this.setStore(user.data, avatar, { friends, pendings, sent });
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    setStore(user: IUser, avatar: string, friendLists: IFriendLists) {
      this.userId = user.id;
      this.username = user.username;
      this.email = user.email;
      this.avatar = avatar;
      this.friendLists = friendLists;
    },
    updateAvatar(avatar: string) {
      this.avatar = avatar;
    },
    async updateFriendLists(userId: number) {
      const friends = await UserService.getFriendships(userId, "accepted");
      const pendings = await UserService.getFriendships(userId, "pending");
      const sent = await UserService.getFriendships(userId, "sent");
      this.friendLists = { friends, pendings, sent };
    }
  },
});
