import { createLogger, createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from 'vue';

import profileModule from './modules/profile';

const debug = process.env.NODE_ENV !== 'production';
const plugins = debug ? [createLogger()] : [];

export default createStore({
  modules: {
    profile: profileModule,
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
