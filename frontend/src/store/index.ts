import { createLogger, createStore, Store } from 'vuex';

import pongModule from './modules/pong';
import chatroomModule from './modules/chatroom';
import authModule from './modules/auth';
import profileModule from './modules/profile';
import socketModule from './modules/socket';

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
