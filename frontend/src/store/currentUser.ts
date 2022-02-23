import { toNumber } from '@vue/shared';
import { defineStore } from 'pinia';

import vuexStore from '@/store';
import UserService from '@/services/UserService';
import { IUser } from '@/models/IUser';
import axios, { AxiosError } from 'axios';
import { IError } from '@/models/IError';

export interface State {
  userId: number | null;
  email: string;
  username: string;
  avatar: ImageData | null; //  string base64 ? 
  // avatar: File;
  //friends, pending requests, etc ?...
}

export const useCurrentUserStore = defineStore('currentUser', {
  state: (): State => ({
    userId: null,
    username: '',
    email: '',
    avatar: null,
  }),
  getters: {
    getAvatarBase64(): string {
      const reader = new FileReader;
      // reader.readAsDataURL(this.avatar?.data.buffer);
      // return `data:${this.avatar?.data.}`
      return ``
    }
  },
  actions: {
    async initStore(myUserId: number) {
      try {
        const resp = await UserService.getUserById(myUserId);
        const resp2 = await UserService.getAvatarOfUser(myUserId);

        this.setStore(resp.data, resp2.data);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    setStore(user: IUser, avatar: ImageData) {
      this.userId = user.id;
      this.username = user.username;
      this.email = user.email;
      this.avatar = avatar;
    },
  },
});
