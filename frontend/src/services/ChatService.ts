import http from "@/http"
import socket from "@/socketApp"
import { ISearchChannel, IUserChannel, IMessage, IChannel, IBlocked } from "shared/models/socket-events";

interface ChannelUpdate {
	title: string;
	password: string;
	isPublic: boolean;
}
  
class ChatService {
	createDm(userId: number, otherUserId: number): Promise<any> {
		return http.post(`/dm/${otherUserId}`);
	}
	createChannel(data: any): Promise<IChannel[]> {
		return http.post(`/channels`, data);
	}
	createMessage(channelId: number, content: any): Promise<IMessage> {
		return http.post(`/channels/${channelId}/messages`, content);
	}
	updateChannel(channelId: number, newPassword: string | null): Promise<any> {
		return http.patch(`/channels/${channelId}`, {password: newPassword});
	}
	joinChannel(channelId: number, data: any): Promise<any> {
		return http.put(`/channels/${channelId}`, data)
	}
	leaveChannel(channelId: number): Promise<any> {
		return http.delete(`/channels/${channelId}`)
	}
	muteUser(channelId: number, userId: number, muteUntil: Date | null): Promise<any> {
		return http.put(`/channels/${channelId}/mute/${userId}`, {date: muteUntil})
	}
	banUser(channelId: number, userId: number, banUntil: Date | null): Promise<any> {
		return http.put(`/channels/${channelId}/ban/${userId}`, {date: banUntil})
	}
	promoteUser(channelId: number, userId: number): Promise<any> {
		return http.put(`/channels/${channelId}/admin/${userId}`)
	}
	blockUser(recipientId: number): Promise<IBlocked[]> {
		return http.post(`/block/${recipientId}`)
	}
	unBlockUser(recipientId: number): Promise<IBlocked[]> {
		return http.delete(`/block/${recipientId}`)
	}
	async getblock(): Promise<IBlocked[]> {
		const blocklist = await http.get(`/block`);
		return blocklist.data;
	}
	searchChannels(term: string): Promise<ISearchChannel[]> {
		return new Promise(resolve => {
			socket.emit('searchChannel', term, (resp: ISearchChannel[]) => {
				resolve(resp)
			})
		})
	}
	searchUsersByTitle(title: string, channelId: number): Promise<IUserChannel[]>  {
		return new Promise(resolve => {
			socket.emit('searchUsersByTitle', {title: title, channelId: channelId}, (resp: any) => {
				resolve(resp)
			})
		})
	}
	searchUsers(title: string): Promise<IUserChannel[]> {
		return new Promise(resolve => {
			socket.emit('searchUsers', {title: title}, (resp: any) => {
				resolve(resp)
			})
		})
	}
	sendUserOfChannels(term: number): Promise<IUserChannel[]> {
		return new Promise(resolve => {
			socket.emit('sendUserOfChannels', term, (resp: IUserChannel[]) => {
				resolve(resp)
			})
		})
	}
	sendMessagesOfChannels(term: number): Promise<IMessage[]> {
		return new Promise(resolve => {
			socket.emit('sendMessagesOfChannels', term, (resp: IMessage[]) => {
				resolve(resp)
			})
		})
	}

}
export default new ChatService();
