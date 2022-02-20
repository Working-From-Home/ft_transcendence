import { createLogger, createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from 'vue';

import pongModule from './modules/pong';
import chatroomModule from './modules/chatroom';
import profileModule from './modules/profile';
import socketModule from './modules/socket';
import { authModule } from './modules/auth/auth';

const debug = process.env.NODE_ENV !== 'production';
const plugins = debug ? [createLogger()] : [];

export default createStore({
  modules: {
    pong: pongModule,
    chatroom: chatroomModule,
    auth: authModule,
    profile: profileModule,
    socket: socketModule,
  },
  strict: debug,
  plugins: plugins,
});

export const key: InjectionKey<Store<any>> = Symbol();

// composition api
export function useStore() {
  return baseUseStore(key);
}

// For option api
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<any>
  }
}
