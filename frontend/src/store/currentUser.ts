import { toNumber } from '@vue/shared';
import { defineStore } from 'pinia';

import UserService from '@/services/UserService';
import { IUser } from '@/models/IUser';
import axios, { AxiosError } from 'axios';
import { IError } from '@/models/IError';

export interface State {
  userId: number | null;
  email: string;
  username: string;
  avatar: string; //  string base64 ? 
  // avatar: File;
  //friends, pending requests, etc ?...
}

export const useCurrentUserStore = defineStore('currentUser', {
  state: (): State => ({
    userId: null,
    username: '',
    email: '',
    avatar: '',
  }),
  getters: {},
  actions: {
    async initStore(myUserId: number) {
      try {
        const resp = await UserService.getUserById(myUserId);
        const resp2 = await UserService.getAvatarOfUser(myUserId);

        this.setStore(resp.data, resp2);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    setStore(user: IUser, avatar: string) {
      this.userId = user.id;
      this.username = user.username;
      this.email = user.email;
      this.avatar = avatar;
    },
  },
});
