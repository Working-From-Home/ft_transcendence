import http from "@/http"
import socket from "@/socketApp"
import { ISearchChannel, IUserChannel, IMessage, IChannel } from "shared/models/socket-events";

interface ChannelUpdate {
	title: string;
	password: string;
	isPublic: boolean;
}

class ChatService {
	/** create a conversation between me and someone */
	createDm(userId: number, otherUserId: number): Promise<any> {
		return http.post(`/dm/${otherUserId}`);
	}
	/** create a new channel */
	createChannel(data: any): Promise<IChannel[]> {
		return http.post(`/channels`, data);
	}
	createMessage(channelId: number, userId: number, content: string): Promise<IMessage> {
		return http.post(`/message`);
	}
	// only the owner can update the channel
	updateChannel(channelId: number, data: Partial<ChannelUpdate>): Promise<any> {
		return http.patch(`/channels/${channelId}`, data);
	}
	/** rest or socket ? */
	joinChannel(channelId: number): Promise<any> {
		return http.put(`/channels/${channelId}`)
	}
	/** rest or socket ? */
	leaveChannel(channelId: number): Promise<any> {
		return http.delete(`/channels/${channelId}`)
	}
	muteUser(channelId: number, userId: number, muteUntil: Date | null): Promise<any> {
		return http.put(`/channels/${channelId}/mute/${userId}`, muteUntil)
	}
	banUser(channelId: number, userId: number, banUntil: Date | null): Promise<any> {
		return http.put(`/channels/${channelId}/ban/${userId}`, banUntil)
	}
	/** Promote a user to admin */
	promoteUser(channelId: number, userId: number): Promise<any> {
		return http.post(`/channels/${channelId}/admin/${userId}`)
	}
	/** Revoque admin to user */
	revokeAdmin(channelId: number, userId: number): Promise<any> {
		return http.delete(`/channels/${channelId}/ban/${userId}`)
	}
	kickUser(channelId: number, userId: number): Promise<any> {
		return http.delete(`/channels/${channelId}/kick/${userId}`)
	}
	searchChannels(term: string): Promise<ISearchChannel[]> {
		return new Promise(resolve => {
			socket.emit('searchChannel', term, (resp: ISearchChannel[]) => {
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
