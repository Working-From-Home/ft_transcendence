import { defineStore } from 'pinia';
import { INotification } from '@/models/INotification';

export interface State {
  notifications: INotification[];
}

export const useNotificationsStore = defineStore('notifications', {
  state: (): State => ({
    notifications: [],
  }),
  getters: {
    length: (state) => {
      return state.notifications.length;
    },
    getHead: (state) => {
      return () => {
        if (state.notifications[0]) return state.notifications[0];
        return { date: '', type: '', header: '', body: '' };
      };
    },
  },
  actions: {
    enqueue(type: string, header: string, body: string) {
      const date = Date.now().toString();
      this.notifications.push({ date, type, header, body });
    },
    dequeue() {
      this.notifications.shift();
    },
  },
});
