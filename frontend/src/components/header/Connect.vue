<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useChatRoomsStore } from '@/store/modules/chatroom/chatroom';
import { useStatusStore } from '@/store/modules/status/status';
import ChatService from '../../services/ChatService';
import { IChannel } from 'shared/models/socket-events';
import socket from '@/socketApp';

const authStore = useAuthStore();
const statusStore = useStatusStore();
const chatRoomsStore = useChatRoomsStore();

const connect = computed<boolean>(() => {
  if (authStore.isLoggedIn) {
    socket.auth = {
      token: `${authStore.token}`,
    };
    socket.connect();

    socket.on('connectedUsers', (userIds: number[]) => {
      console.log(`userIds: ${userIds}`);
      statusStore.setOnlineUsers(userIds);
    });
    socket.on('connect_error', (err: any) => {
      console.log(`socket connexion error: ${err}`);
    });
    socket.on('sendChannels', async (resp: IChannel[]) => {
      for (const obj of resp) {
        obj['users'] = await ChatService.sendUserOfChannels(obj['roomId']);
        obj['messages'] = await ChatService.sendMessagesOfChannels(
          obj['roomId'],
        );
      }
      chatRoomsStore.fetchRooms(resp);
    });
    socket.on('sendChannel', async (resp: IChannel[]) => {
      resp[0]['users'] = await ChatService.sendUserOfChannels(
        resp[0]['roomId'],
      );
      resp[0]['messages'] = await ChatService.sendMessagesOfChannels(
        resp[0]['roomId'],
      );
      chatRoomsStore.fetchRoom(resp);
    });
    socket.on('leaveChannel', async (channelId: number) => {
      chatRoomsStore.leaveChannel(channelId);
    });
  }
  return authStore.isLoggedIn;
});
</script>

<template>
  <div v-if="connect"></div>
</template>
