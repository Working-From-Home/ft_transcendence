import { toNumber } from '@vue/shared';
import { defineStore } from 'pinia';
import api from '@/services/AuthService';
import { useCurrentUserStore } from '@/store/currentUser';
import { useLocalStorage, useStorage } from '@vueuse/core';

import { IError } from '@/models/IError';
import axios, { AxiosError } from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useLocalStorage('token', ''),
    refreshToken: useLocalStorage('refreshToken', ''),
    registerInProgress: useLocalStorage('registerInProgress', false),
		twoFaEnabled: useLocalStorage('twoFaEnbaled', false),
		twoFaAuthenticated: useLocalStorage('twoFaAuthenticated', false)
  }),
  getters: {
    isLoggedIn: (state) => {
      if (state.token === '' && state.registerInProgress == false)
				return false;
			if (state.twoFaEnabled && !state.twoFaAuthenticated)
				return false;
			return true;
		},
    tokenBearer(): string {
      return this.token === '' ? '' : 'Bearer ' + this.token;
    },
  },
  actions: {
    // local
    async signInLocal(
      email: string,
      password: string,
    ): Promise<IError | undefined> {
      try {
        const resp = await api.signInLocal(email, password);
        this.setState(resp.data.access_token);
				this.twoFaEnabled = resp.data.twoFaEnabled;
				if (!this.twoFaEnabled)
        	await useCurrentUserStore().initStore(resp.data.id);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    async signUpLocal(email: string, password: string) {
      try {
        const resp = await api.signUpLocal(email, password);
        this.setState(resp.data.access_token, true);
				this.twoFaEnabled = resp.data.twoFaEnabled;

        await useCurrentUserStore().initStore(resp.data.id);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    // google
    async signInGoogle(params: string): Promise<IError | undefined> {
      try {
        const resp = await api.signInGoogle(params);
        this.setState(resp.data.access_token);
				this.twoFaEnabled = resp.data.twoFaEnabled;

				if (!this.twoFaEnabled)
        	await useCurrentUserStore().initStore(resp.data.id);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    async signUpGoogle(params: string) {
      try {
        const resp = await api.signUpGoogle(params);
        this.setState(resp.data.access_token, true);
				this.twoFaEnabled = resp.data.twoFaEnabled;

        await useCurrentUserStore().initStore(resp.data.id);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },

    // 42
    async signInFortyTwo(params: string): Promise<IError | undefined> {
      try {
        const resp = await api.signInFortyTwo(params);
        this.setState(resp.data.access_token);
				this.twoFaEnabled = resp.data.twoFaEnabled;

				if (!this.twoFaEnabled)
        	await useCurrentUserStore().initStore(resp.data.id);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    async signUpFortyTwo(params: string) {
      try {
        const resp = await api.signUpFortyTwo(params);
        this.setState(resp.data.access_token, true);
				this.twoFaEnabled = resp.data.twoFaEnabled;

        await useCurrentUserStore().initStore(resp.data.id);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    async initStore() {
      if (!!this.token) {
        await useCurrentUserStore().initStore(null);
      }
    },
    setState(token: string, registerInProgress: boolean = false) {
      this.token = token;
      this.registerInProgress = registerInProgress;
    },
    logout() {
      api.logout().finally(() => {
        this.clearApp();
      });
    },
    async deleteAccount() {
      await api.deleteAccount(); // deal the response or balec ?
      this.clearApp();
    },
    clearApp() {
      localStorage.clear();
      this.$reset();
      useCurrentUserStore().$reset();
    },
  },
});
