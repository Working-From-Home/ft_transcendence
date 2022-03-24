<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useChatRoomsStore } from '@/store/chatroom';
import { useStatusStore } from '@/store/status';
import ChatService from '../../services/ChatService';
import { IChannel } from 'shared/models/socket-events';
import socket from '@/socketApp';
import { useCurrentUserStore } from '@/store/currentUser';
import UserService from '@/services/UserService';
import { useNotificationsStore } from '@/store/notifications';

const authStore = useAuthStore();
const statusStore = useStatusStore();
const chatRoomsStore = useChatRoomsStore();
const currentUserStore = useCurrentUserStore();
const notificationsStore = useNotificationsStore()

const chatRooms = computed<any>(() => {
  return chatRoomsStore.getRooms;
})

const connect = computed<boolean>(() => {
  if (authStore.isLoggedIn) {
    socket.auth = {
      token: `${authStore.token}`,
    };
    socket.connect();
  
    socket.on('connectedUsers', (userIds: number[]) => {
      statusStore.setOnlineUsers(userIds);
    });
    socket.on('connect_error', (err: any) => {
      console.log(`socket connexion error: ${err}`);
    });
	/* channel events */
    socket.on('sendChannels', async (resp: IChannel[]) => {
	  let blocked = await ChatService.getblock();
	  chatRoomsStore.listBlock(blocked)
      for (const obj of resp) {
        obj['users'] = await ChatService.sendUserOfChannels(obj['roomId']);
		if (obj.isDm === true){
			let userBy = await UserService.getUserById(currentUserStore.userId)
			for (const user of obj.users){
				if (user.username != userBy.data.username){
					obj.roomName = user.username;
					await UserService.getAvatarOfUser(user._id).then((av: string ) => (obj.avatar = av));
				}
			}
		}
		else {
			if (!obj.isPassword)
				obj.avatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAFQklEQVRoge2YW2wUZRiG339mdmeP3UMXbKGltNATC12gGEOharkwYLBA9ALihVyYmJBoYuIhRm80euENERONMR5BIxpjImIoibVAiEiUiIWSdot0pdvdttB2drc73Z3T7wXHFto57Hq3T7IXO/neb953Zv6ZbwYoUaJEiRIlSoCYFdTUhDtYt/1lTdU2UUnxWukxrxmWSAxvu6rJ6lc8ye8fGBjIGNYaLWxtbbVNispnDM/tDHS2uF3hSsL5HAApWg5okgopLiDVExWn/47PaLK6bfhK3x9GtIZd1DZHDvE15bsq9rW7GZ4DlVWI/WOQEwI0UbbuHgDj5uF/rGnWtmzvCB3/5LdpIksbrlzpj+r1MBRk+fLVj7J+/qfqt7Z7GJ6D2JdELjoO99oq2Kv8IDbWYoSFEbqj2tTPF84O9Z1v06tljDQkLturgc4W960QypSI4K4I+Nry/y0EAPg66hkQEqmqa67XqzUUhKpamytcSaisIhcdR9nmFYW7NABhCFzhSsqCbder5Yz0o7LiYX0OiBcScEeWGjJBZxQ4J2V4OAfsLAdRySPNKtBCvKkbBBd0uUBRoVtnoBcBCCGEQEqm4drSMH/ljIImsQwbFq/EuoYVaGlsBsPcOemCkMKpi+dwaSqO39NDyCzSvywZliWUUl2fRoLcQVbvuyYopai/5sAzax5HW2T9vHK/34fOzVvQCSCVzuDLU0fRlYsiX1b4OjO0RhZEUrF1uhof7H5xwRBz8ZV58cL2PXhnzVOomLg3iHgxYcpGYUFkFTu0Brzy5F5wnLmTe4t1jWG82f40KqZmh9Ek1VSfgoK0CH48/8TuQloAAFZWLcO+1dvAZZU7xuzmLjfLQdi0jOfatoMUaUTZFF6Lh+iS2//zsUlTestBmrVyNNUW93nyyLIW4OYlZVviM6W1HGRlme6t3TQPR1rhmLgxt3nWV5vSWg4S5N1WpfNis9ngZ50AgFT3gCmt5SAK1axKFySnSgAAbcbcRG05SEKcsiqdl+FEAmmHtQNkOcgFYRiKau5er0fXxbPQArwlreUgoyENh08csyq/h0w2i5PX+y3rLQchDMEP189j8GrM8s7v5sCxw0iGrJ/hgp7sqQDw9unDGIrHC2mD9378Gr86CutR8NAYDyl46fTn+O7kcdPa0YlreO3bD3GEvQxiciSZi7VJbw5CkOCj6bMQu2awd+tO3fqR0SS+P3cCpzL/QAgCBIWP8aaCUAKA0vu+4TEKRXPNcgDAwe4jiGbGUOkMwMc7QShBVslDkERcTifxL5OGErADwYL938ZUEM7rhJLKgfM7Z22nGsX6cS9ivlEc/GY/+ssygIsFMAZIdxXaAJQDgF1/Z9SMM2NrRCMskbW8AueqByD2jtxTQLIyep2T+Fj6E/3lIlDglxWqqKA3k6jZvASQlJ7G0GJn7NywNCLAFvJAEWagpnOzC7x2KIsdFizfn1T3ALwbawEAudhEjlBN9wOdoSCarB5K9QyKAODfugpTXZeQH9E9SKahigrh+CXYl/phC3kgJVOQEilCiNijpzX0VtTY2OjNgR+qeLYt6G5ZSqhGkTkzBGUie6ODUuAAyZAbPwDejbWwhTygsor4u79k5dH067HB3gNFCQIA1XXhBzkb2x3YEXH7OuoZwhTv4/VcpGQaY5+eycqT2aOxvr/2wMDSN+Wmrq6pgfLOL8Ai4lpVQbmAy0WK9a4LQJNUOTd0XcyPCCyh5I3YYO/7MHj/smSiqq65ngXbTjW6yIp+ATs5QrUoIWJPLBbL6deXKFGiRIkSxeE/M8LeqkKhTv8AAAAASUVORK5CYII="
			else
				obj.avatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAHP0lEQVRoge2Za2xbZxnH/+/xOT6+JLZzKThzmluTJo5zaZOwkbTdkkxi7Wi7TQRWBBOtOglpNwlttOIDaAyQJooioAxVdNC13aDSSkQZtBEjWTaFblET1iZpiN2uuTmXZomv8Unsc3n5sLZprraPO8EH/yR/8NHzPH5+57znPe95DSRJkiRJkiRJQOJNyM11NGiM2u8rsrKNRqRUNTXWbEZDIgzPjSqi/CZPws1OpzMYc26sgdXV1ZxHkP7A8OzjaXsrjAZHFmHNOoDcMw8oERkRtw/+91zC3BX3vCLKu8ZuXL0US27MXeTbK0/zuRlPWJ/ZYWR4FlSUIQzehDjhgyKI6rsHwBh5WL5SsuRYqHecTr9+cY6IkZobNwZd0WrEJJKXV1avsfDvbHxldwrDsxCuTmLBNQ3jlmxosy0gnEalwvr42lyK9+99XUNXL9dFi2ViKUgM3OG0vRXG2xKSV0D6E5Xg8zM+NwkAMDcUMSCkMrvAXhQtNiYRKit1BkcWoaKMBdc0TNs3Jd5lDBCGwODIohpodkSLZWOpR0UpRWPWQeibgLHSFlMTdF6C3iMihdVBq2EhSGEENBKUTD6uCYJNNxhAYY0aF0MtAhBCCEFkMgBD4+a1I+cllAgm1HyhEFs3b0JFsR0Ms3jRfT4/PujvwYDXjY8CQwhuiD4sGY2GUEqj9hmLyCKivOo9QSlF0ac6fKf8UdRVVq2ZbrGYsXd7I/YC8AeCOPnB39C64ELYlPh9FtM9si4RGTvnNuK1fd9bV2I5ZlMqXtj9TfysvAnW2ZUiQv9EXG0kJiLKeEzZjENf2w+Wje/i3mZrsQM/3vEtWL1LZZSIHFedhEQqfBY8v2dfIiUAAIXZOXimbBfYkLTYmDa+4aZaRBMQ8d263SD3aImyzbEFD9D77nwPD3viylctYlcyUJJ/b58nD+VUALeGFHefOa5c1SKFpqhTe9w8WFkN3exn67aUqo1x5aoWSeeNalPXhOM4WDR6AIC/zRlXrmoRiSpqU9dlQY4AAJT5+FbUqkUmBK/a1DUZm5hAQKfuBKkW6fONQZLjm+uj0drfBSWNV5WrWmQqU8GZjgtq01cQDIXw/syg6nzVIoQhaJm5jGujw6p//G5+deEMJjPVX2F164pb+NOAn3aewcsPfhv52dmq6/zy3Ftone3HwrvjkK/PIuwNgVAgMBJAWJFACI063hISAQB3poSXOk/gyaz78Y2HHokrd2r2UzRfOIP21jZIrhkceOrraHj2y8iybkAkIuI/zk9wtuUCOj6ZfTG/sOLjoeu9Zz83EQDwpRMcm+uC0DqP/Tsfjxo/PjWJsz0d6PC4MPxWJ2qL7TjSfgwGgw5erx9t7f9CRmYaGutr8XBDHfr6nfyBgy+d5EurswYHeo4mLEIJAEpXfcNjJAp7bh4A4FTbX+EK3kSWPg1mXg9CCUJSGL6IgOuBSYwwAUhpWgTarqC2uBS/aX4ZhBB4vX78+ugJPH1wH9zuKRx97SReeG4/ysuKca7luOHRPQdezc0t7x4Z6fswIRE2VQ/JvwDWol8qqFBUTadi2DyFU39qxqApCBg0AG4CkbsCOQAZAKBFxO2DODCNI+2/vbPw/Gd7J54+uA82mxU2mxUst9iezWbFT1550fDDH/3iOEZQtuJExtC/QjREVMIS9KVfhNA7viKAhET06j34XaQbgxkCEMPOynzXKA481QSDQXfnmN8fhNmceud7ddXSfvd89WGwLJeXk+MoXV4vpivCaNmxyLhvk64gE0HfPOTAAjSmxQaQqoWUunb+asjXZ9HwbC0A4PdvtOD9TicEYQ6dXaMrXg18ngn88eSr0Ot5NDbUMmdbztcDGIhbRBHl0/73rh3SFWQaLDtL4fnLFaRu2wTeFt9S+27C3hCyrBsAAF5vAJzZjvSM1WdZPixDliUAPPJys3Ucy+Ysj4lJhCfh5rkr7udTesf1xgobyWjaiuCHQwj1jH62VynFvz4iFAiHI9EDlyEIgiLLdMXmdkwiTqczuLHAsWv69YttaY9VGs0NRYxpW0HcTdyNfzwE57Uh2Gzxvdf09g2GZEW6tvx4zLPW2I2rlwoKSmq87/S/4T3fX2kotVI2zWAgKt91w1IEb//5PBrra2EypUASw9CwazzAqQye18Lj9eFSd5+Wodp/qBYBgFu74nXZBfaiue6xHVShG9RI3ILvGPb9oK/fqXuy6RFc/KgZ/gALSpeeFwIZ92/NA8dx+PmRY2GOY065Bv/tS+B37z35hRVNVTXbQ6MjA1SRvTTgd1OvZ3TJZ2H+JlVkL33z9AnZXvYld17eFsv/uu9VKSmpea688oHQuXNvK7LkoYrsXfKZmRmihw4fXrA7asbX25W/d383JUBubnmtyWI4zrJcXmNDLZOTY9NHwmH548sDQndPH8dxzKlQUDo8PHx5zSH1fyFym5wcRylhUc+xXLYoigIFdTJU++56AkmSJImN/wIvEtBs2epkJAAAAABJRU5ErkJggg=="
		}
		obj["messages"] = await ChatService.sendMessagesOfChannels(obj["roomId"]);
	  }
      chatRoomsStore.fetchRooms(resp);
    });
    socket.on('sendChannel', async (resp: IChannel[]) => {
      resp[0]['users'] = await ChatService.sendUserOfChannels(
        resp[0]['roomId'],
      );
	  if (resp[0].isDm === true){
		for (const user of resp[0].users)
			if (user.username != currentUserStore.username){
				resp[0].roomName = user.username;
			await UserService.getAvatarOfUser(user._id).then((av: string ) => (resp[0].avatar = av));
		}
	  }
	  else {
		if (!resp[0].isPassword)
			resp[0].avatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAFQklEQVRoge2YW2wUZRiG339mdmeP3UMXbKGltNATC12gGEOharkwYLBA9ALihVyYmJBoYuIhRm80euENERONMR5BIxpjImIoibVAiEiUiIWSdot0pdvdttB2drc73Z3T7wXHFto57Hq3T7IXO/neb953Zv6ZbwYoUaJEiRIlSoCYFdTUhDtYt/1lTdU2UUnxWukxrxmWSAxvu6rJ6lc8ye8fGBjIGNYaLWxtbbVNispnDM/tDHS2uF3hSsL5HAApWg5okgopLiDVExWn/47PaLK6bfhK3x9GtIZd1DZHDvE15bsq9rW7GZ4DlVWI/WOQEwI0UbbuHgDj5uF/rGnWtmzvCB3/5LdpIksbrlzpj+r1MBRk+fLVj7J+/qfqt7Z7GJ6D2JdELjoO99oq2Kv8IDbWYoSFEbqj2tTPF84O9Z1v06tljDQkLturgc4W960QypSI4K4I+Nry/y0EAPg66hkQEqmqa67XqzUUhKpamytcSaisIhcdR9nmFYW7NABhCFzhSsqCbder5Yz0o7LiYX0OiBcScEeWGjJBZxQ4J2V4OAfsLAdRySPNKtBCvKkbBBd0uUBRoVtnoBcBCCGEQEqm4drSMH/ljIImsQwbFq/EuoYVaGlsBsPcOemCkMKpi+dwaSqO39NDyCzSvywZliWUUl2fRoLcQVbvuyYopai/5sAzax5HW2T9vHK/34fOzVvQCSCVzuDLU0fRlYsiX1b4OjO0RhZEUrF1uhof7H5xwRBz8ZV58cL2PXhnzVOomLg3iHgxYcpGYUFkFTu0Brzy5F5wnLmTe4t1jWG82f40KqZmh9Ek1VSfgoK0CH48/8TuQloAAFZWLcO+1dvAZZU7xuzmLjfLQdi0jOfatoMUaUTZFF6Lh+iS2//zsUlTestBmrVyNNUW93nyyLIW4OYlZVviM6W1HGRlme6t3TQPR1rhmLgxt3nWV5vSWg4S5N1WpfNis9ngZ50AgFT3gCmt5SAK1axKFySnSgAAbcbcRG05SEKcsiqdl+FEAmmHtQNkOcgFYRiKau5er0fXxbPQArwlreUgoyENh08csyq/h0w2i5PX+y3rLQchDMEP189j8GrM8s7v5sCxw0iGrJ/hgp7sqQDw9unDGIrHC2mD9378Gr86CutR8NAYDyl46fTn+O7kcdPa0YlreO3bD3GEvQxiciSZi7VJbw5CkOCj6bMQu2awd+tO3fqR0SS+P3cCpzL/QAgCBIWP8aaCUAKA0vu+4TEKRXPNcgDAwe4jiGbGUOkMwMc7QShBVslDkERcTifxL5OGErADwYL938ZUEM7rhJLKgfM7Z22nGsX6cS9ivlEc/GY/+ssygIsFMAZIdxXaAJQDgF1/Z9SMM2NrRCMskbW8AueqByD2jtxTQLIyep2T+Fj6E/3lIlDglxWqqKA3k6jZvASQlJ7G0GJn7NywNCLAFvJAEWagpnOzC7x2KIsdFizfn1T3ALwbawEAudhEjlBN9wOdoSCarB5K9QyKAODfugpTXZeQH9E9SKahigrh+CXYl/phC3kgJVOQEilCiNijpzX0VtTY2OjNgR+qeLYt6G5ZSqhGkTkzBGUie6ODUuAAyZAbPwDejbWwhTygsor4u79k5dH067HB3gNFCQIA1XXhBzkb2x3YEXH7OuoZwhTv4/VcpGQaY5+eycqT2aOxvr/2wMDSN+Wmrq6pgfLOL8Ai4lpVQbmAy0WK9a4LQJNUOTd0XcyPCCyh5I3YYO/7MHj/smSiqq65ngXbTjW6yIp+ATs5QrUoIWJPLBbL6deXKFGiRIkSxeE/M8LeqkKhTv8AAAAASUVORK5CYII="
		else
			resp[0].avatar = "data:image/png;base64,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"
	  }
      resp[0]['messages'] = await ChatService.sendMessagesOfChannels(
        resp[0]['roomId'],
      );
      chatRoomsStore.fetchRoom(resp);
    });
    socket.on('leaveChannel', async (channelId: number) => {
      chatRoomsStore.leaveChannel(channelId);
    });
    /* friends events */
    socket.on('requestReceived', () => {
      currentUserStore.updatePendings(currentUserStore.userId);
    });
    socket.on('requestAccepted', () => {
      currentUserStore.updateSent(currentUserStore.userId);
      currentUserStore.updateFriends(currentUserStore.userId);
    });
    socket.on('requestDeclined', () => {
      currentUserStore.updateSent(currentUserStore.userId);
    });
    socket.on('friendshipEnded', () => {
      currentUserStore.updateFriends(currentUserStore.userId);
    });

    socket.on("changeParam", async (param: string, channelId: number, userId: number, content: Date | null) => {
			for (const obj of chatRooms.value) {
				if (obj.roomId.toString() === channelId.toString()){
					if (param === "ban"){
						notificationsStore.enqueue("info", "Banned", "You're banned from the Channel " + obj.roomName)
					}
					else if (param === "unban"){
						notificationsStore.enqueue("info", "Unbanned", "You're unbanned from the Channel " + obj.roomName + ". You can now join.")
					}
					else if (param === "mute"){
						notificationsStore.enqueue("info", "Banned", "You're muted in the Channel " + obj.roomName)
					}
					else if (param === "unmute"){
						notificationsStore.enqueue("info", "Unbanned", "You're unmuted in the Channel " + obj.roomName)
					}
				}
			}
			chatRoomsStore.addParam(param, channelId, userId, content);
		});

  }
  return authStore.isLoggedIn;
});
</script>

<template>
  <div v-if="connect"></div>
</template>
