import { toNumber } from '@vue/shared';
import { defineStore } from 'pinia';
import api from '@/services/AuthService';
import { useCurrentUserStore } from '@/store/currentUser';

import { IError } from '@/models/IError';
import axios, { AxiosError } from 'axios';

export interface State {
  userId: number | null;
  token: string;
  refreshToken: string;
  registerInProgress: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    token: '',
    refreshToken: '',
    registerInProgress: false,
    userId: null, // remove soon ?
  }),
  getters: {
    isLoggedIn: (state) => state.token !== '' && state.registerInProgress == false,
    tokenBearer(): string {
      return this.token === '' ? '' : 'Bearer ' + this.token;
    },
  },
  actions: {
    async signIn(email: string, password: string): Promise<IError | undefined> {
      try {
        const resp = await api.signInLocal(email, password);
        this.setState(resp.data.access_token, resp.data.id);

        useCurrentUserStore().initStore(resp.data.id); // wip
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    async signUp(email: string, password: string) {
      try {
        const resp = await api.signUpLocal(email, password);
        this.setState(resp.data.access_token, resp.data.id);

        useCurrentUserStore().initStore(resp.data.id); // wip
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    initStore() {
      const token: string | null = localStorage.getItem('token');
      const userId: number | null = toNumber(localStorage.getItem('userId'));
      const username: string | null = localStorage.getItem('username');
      const email: string | null = localStorage.getItem('email');
      const avatar: string | null = localStorage.getItem('avatar');

      
      if (token && userId) {
        useCurrentUserStore().initStore(userId); // wip
        this.setState(token, userId);
      }
    },
    setState(token: string, userId: number) {
      this.token = token;
      this.userId = userId;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId.toString());
    },
    logout() {
      api.logout()
      .finally(() => {
        this.clearApp();
      });
    },
    async deleteAccount() {
      await api.deleteAccount(); // deal the response or balec ?
      this.clearApp();
    },
    clearApp() {
      this.$reset();
      useCurrentUserStore().$reset();
      localStorage.clear();
    }
  },
});
