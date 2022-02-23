import { toNumber } from '@vue/shared';
import { defineStore } from 'pinia';
import api from '@/services/AuthService';
import { useCurrentUserStore } from '@/store/currentUser';

import vuexStore from '@/store';
import { IError } from '@/models/IError';
import axios, { AxiosError } from 'axios';

export interface State {
  userId: number | null;
  token: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    token: '',
    userId: null, // remove soon ?
  }),
  getters: {
    isLoggedIn: (state) => state.token !== '',
    tokenBearer(): string {
      return this.token === '' ? '' : 'Bearer ' + this.token;
    },
  },
  actions: {
    async signIn(username: string, password: string): Promise<IError | undefined> {
      const currentUserStore = useCurrentUserStore();
      try {
        const resp = await api.signInLocal(username, password);
        this.setState(resp.data.access_token, resp.data.id);

        currentUserStore.initStore(resp.data.id); // wip
        vuexStore.dispatch('getProfile', { id: resp.data.id, token: resp.data.access_token });
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    async signUp(username: string, email: string, password: string) {
      const currentUserStore = useCurrentUserStore();
      try {
        const resp = await api.signUpLocal(email, username, password);
        this.setState(resp.data.access_token, resp.data.id);

        currentUserStore.initStore(resp.data.id); // wip
        vuexStore.dispatch('getProfile', { id: resp.data.id, token: resp.data.access_token });
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
        this.setState(token, userId);
        vuexStore.commit('initProfile', { username: username, userId: userId, email: email });
        vuexStore.commit('initAvatar', { avatar: avatar });
      }
    },
    setState(token: string, userId: number) {
      this.token = token;
      this.userId = userId;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId.toString());
    },
    clearState() {
      this.token = '';
      this.userId = null;
    },
    logout() {
      api.logout()
      .finally(() => {
        this.clearState();
        localStorage.clear();
      });
    },
    async deleteAccount() {
      await api.deleteAccount(); // deal the response or balec ?
      this.clearState();
      localStorage.clear();
    },
  },
});
