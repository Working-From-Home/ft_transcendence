import { toNumber } from '@vue/shared';
import { defineStore } from 'pinia';

import UserService from '@/services/UserService';
import FriendService from '@/services/FriendService';
import { IUser } from '@/models/IUser';
import axios, { AxiosError } from 'axios';
import { IError } from '@/models/IError';
import { IFriendLists } from '@/models/IFriendLists';
import { useLocalStorage, useStorage } from '@vueuse/core';

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    userId: useLocalStorage('userId', 0),
    username: '',
    email: '',
    avatar: '',
    friendLists: {
      friends: [],
      pendings: [],
      sent: []
    } as IFriendLists,
  }),
  getters: {
    isFriend : (state) => {
			return (id : number) => state.friendLists.friends.some(friend => friend.id === id);
		},
    isPending : (state) => {
			return (id : number) => state.friendLists.pendings.some(pending => pending.id === id);
		},
    isSent : (state) => {
			return (id : number) => state.friendLists.sent.some(sent => sent.id === id);
		},
  },
  actions: {
    async initStore(userId: number | null) {
      if (userId)
        this.userId = userId;
      try {
        const user = await UserService.getUserById(this.userId);
        const avatar = await UserService.getAvatarOfUser(this.userId);   
        const friends = await FriendService.getFriendships(this.userId, "accepted");
        const pendings = await FriendService.getFriendships(this.userId, "pending");
        const sent = await FriendService.getFriendships(this.userId, "sent");
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
    async updateFriends(userId: number) {
      this.friendLists.friends = await FriendService.getFriendships(userId, "accepted");
    },
    async updatePendings(userId: number) {
      this.friendLists.pendings = await FriendService.getFriendships(userId, "pending");
    },
    async updateSent(userId: number) {
      this.friendLists.sent = await FriendService.getFriendships(userId, "sent");
    },
  },
});
