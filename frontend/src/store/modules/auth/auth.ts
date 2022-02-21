import { UserLog, UserUp, FetchData } from '@/store/modules/auth/type';
import { toNumber } from '@vue/shared';
import { defineStore } from 'pinia';
import api from '@/services/AuthServices';

import vuexStore from '@/store';

export interface State {
  userId: number | null;
  token: string;
  tokenExpiration: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    userId: null,
    token: '',
    tokenExpiration: '',
  }),
  getters: {
    // useless now with pinia (just access the variable directly)
    // userID(state: State): number | null {
    //   return state.userId;
    // },
    isLoggedIn: (state) => state.token !== '',
    tokenBearer(): string {
      return this.token === '' ? '' : 'Bearer ' + this.token;
    },
  },
  actions: {
    async signIn(payload: UserLog) {
      return this.auth(payload, 'signIn');
    },
    async signUp(payload: UserUp) {
      return this.auth(payload, 'signUp');
    },
    async auth(payload: any, mode: string) {
      let url: string = process.env.VUE_APP_BACKEND_SERVER_URI + '/auth/signup';
      if (mode === 'signIn') url = process.env.VUE_APP_BACKEND_SERVER_URI + '/auth/signin';

      const fetchData: FetchData = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers(),
      };
      fetchData.headers.append('Content-Type', 'Application/json');

      await fetch(url, fetchData)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to authenticate. Check your login data.');
          return response.json();
        })
        .then((data) => {
          console.log('Success:', data);

          this.setState(data.access_token, data.id);

          vuexStore.dispatch('getProfile', {
            ...payload,
            id: data.id,
            token: data.access_token,
          });
          return data;
        })
        .catch((error) => {
          throw error.message;
        });
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
    logout() {
      this.clearState();
      localStorage.clear();
    },
    setState(token: string, userId: number) {
      // to remove
      this.token = token;
      this.userId = userId;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId.toString());
    },
    clearState() {
      this.token = '';
      this.tokenExpiration = '';
      this.userId = null;
    },
    deleteUser() {
      let url: string = process.env.VUE_APP_BACKEND_SERVER_URI + '/users/' + this.userId;
      const fetchData: FetchData = {
        method: 'DELETE',
        body: '',
        headers: new Headers(),
      };
      const newToken: string = 'Bearer ' + this.token;
      fetchData.headers.append('Authorization', newToken);
      fetch(url, fetchData)
        .then((response) => response.json())
        .then((data) => {
          console.log('Success delete:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
          throw error;
        });
    },
  },
});
