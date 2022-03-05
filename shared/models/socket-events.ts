// doc:
// https://socket.io/docs/v4/typescript/
// https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
// https://stackoverflow.com/questions/38506952/how-to-send-response-back-to-client-using-socket-io
// https://socket.io/docs/v4/emitting-events/#acknowledgements

export interface ISearchChannel
{
	id: number;
	title: string;
}
export interface IMessage {
    _id: number;
	username: string | null;
    content: string;
	createdAt: string;
    date: string;
    channelId: number;
	senderId: number;
}

export interface IUserChannel {
    _id: number;
	username: string;
    channelId: number;
	password: string | null;
	isOwner: boolean;
    isAdmin: boolean;
    mutedUntil: Date | null;
}

export interface IChannel {
	roomId: number;
	isDm: boolean;
	roomName: string;
	createdAt: Date;
	owner: IUserChannel;
	messages: IMessage[] | null;
	users: IUserChannel[];
}

/// Online events
interface ServerToClientEventsOnline {
  connectedUsers: (users: number[]) => void;
  userConnected: (userId: number ) => void;
  userDisconnected: (userId: number ) => void;
  numberOfOnlineUsers: (nbUsers: number ) => void;
}

interface ClientToServerEventsOnline {}

/// Chat events
interface ServerToClientEventsChat {
  sendChannels: (channels: IChannel[]) => void;
  sendChannel: (channels: IChannel[]) => void;
  sendMessage: (message: IMessage[]) => void;
  leaveChannel: (channelId: number) => void;
  sendUserChannels: (channelId: number, users: IUserChannel[]) => void;
}

interface ClientToServerEventsChat {
  searchChannel: (title: string, callback: (channels: ISearchChannel[]) => void) => void;
  sendMessage: (channelId: number, content: string) => void; // maybe not string if we keep emoji...
  sendUserOfChannels: (channelId: number, callback: (channels: IUserChannel[]) => void) => void;
  sendMessagesOfChannels: (channelId: number, callback: (channels: IMessage[]) => void) => void;
}

// Common
export interface ServerToClientEvents
	extends 
		ServerToClientEventsOnline,
    ServerToClientEventsChat
{
	error: (error: any) => void;
}

export interface ClientToServerEvents
  extends ClientToServerEventsOnline,
  ClientToServerEventsChat
{

}

export interface InterServerEvents {}

export interface SocketData {
  userId: number;
}