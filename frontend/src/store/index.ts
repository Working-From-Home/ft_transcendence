import { createStore } from "vuex";

import pongModule from './modules/pong';
import chatroomModule from './modules/chatroom';
import usersModule from './modules/chatroom';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
	  pong: pongModule,
	  chatroom: chatroomModule,
	  users: usersModule
  },
});
