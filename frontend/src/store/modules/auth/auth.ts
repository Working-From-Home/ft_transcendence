import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { AuthState, UserLog, UserUp, FetchData } from '@/store/modules/auth/type';
import { toNumber } from '@vue/shared';

export const authModule: Module<AuthState, any> = {
  state: {
    userId: null,
    token: '',
    tokenExpiration: ''
  },
  getters: {
    userID(state: AuthState): number | null {
      return state.userId;
    },
    tokenRaw(state: AuthState): string {
      return state.token;
    },
    tokenBearer(state: AuthState): string {
      if (state.token)
        return 'Bearer ' + state.token;
      return '';
    },
    isAuth(state: AuthState): boolean {
      return state.token !== '';
    },
  },
  actions: {
    async signIn(context: any, payload: UserLog) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'signIn',
      });
    },
    async signUp(context: any, payload: UserUp) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'signUp',
      });
    },
    async auth(context: any, payload: any) {
      let url: string = process.env.VUE_APP_BACKEND_SERVER_URI + '/auth/signup';
      if (payload.mode === 'signIn') url = process.env.VUE_APP_BACKEND_SERVER_URI + '/auth/signin';
  
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
  
          const expiration: number = new Date().getTime() + 3600000;
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('tokenExpiration', expiration.toString());
  
          context.commit('SIGN_IN', {
            token: data.access_token,
            userId: data.id,
          });
  
          context.dispatch('getProfile', {
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
    initStore(context: any) {
      const token: string | null = localStorage.getItem('token');
      const userId: number | null = toNumber(localStorage.getItem('userId'));
      const username: string | null = localStorage.getItem('username');
      const email: string | null = localStorage.getItem('email');
      const avatar: string | null = localStorage.getItem('avatar');
      const tokenExpiration: string | null = localStorage.getItem('tokenExpiration');
  
      if (token && userId) {
        context.commit('SIGN_IN', {
          token: token,
          userId: userId,
        });
        context.commit('initProfile', {
          username: username,
          userId: userId,
          email: email,
        });
        context.commit('initAvatar', {
          avatar: avatar,
        });
      }
    },
    logout(context: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('avatar');
  
      context.commit('LOG_OUT', {
        token: null,
        userId: null,
      });
    },
    deleteUser(context: any, payload: any) {
      let url: string = process.env.VUE_APP_BACKEND_SERVER_URI + '/users/' + payload.userId;
      const fetchData: FetchData = {
        method: 'DELETE',
        body: '',
        headers: new Headers(),
      };
      const newToken: string = 'Bearer ' + payload.token;
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
  mutations: {
    SIGN_IN(state: AuthState, payload: { token: string; userId: number }) {
      state.token = payload.token;
      state.userId = payload.userId;
    },
    LOG_OUT(state: AuthState) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('username'); // where ? 
      localStorage.removeItem('email'); // where ?
      localStorage.removeItem('avatar'); // where ?
  
      state.token = '';
      state.tokenExpiration = '';
      state.userId = null;
    },
  }
};
