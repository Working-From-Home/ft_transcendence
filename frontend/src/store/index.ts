import { createStore } from "vuex";

import pongModule from './modules/pong';
import chatroomModule from './modules/chatroom';
import authModule from './modules/auth';
import profileModule from './modules/profile';

export default createStore({
  modules: {
	  pong: pongModule,
	  chatroom: chatroomModule,
	  auth: authModule,
	  profile: profileModule
  },
});
