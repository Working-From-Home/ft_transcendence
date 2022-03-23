// doc:
// https://socket.io/docs/v4/typescript/
// https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
// https://stackoverflow.com/questions/38506952/how-to-send-response-back-to-client-using-socket-io
// https://socket.io/docs/v4/emitting-events/#acknowledgements

export interface ISearchChannel {
	id: number;
	title: string;
	password: string;
}

export interface IBlocked {
	applicantId: number;
	recipientId: number;
	createdAt: Date | null;
}
export interface IMessage {
    _id: number;
	username: string | null;
    content: string;
	createdAt: string;
    date: string;
    channelId: number;
	senderId: number;
	deleted: boolean | null;
}

export interface IUserChannel {
    _id: number;
	username: string;
    channelId: number;
	password: string | null;
	isOwner: boolean;
    isAdmin: boolean;
    mutedUntil: Date | null;
	bannedUntil: Date | null;
}

export interface IChannel {
	roomId: number;
	isDm: boolean;
	roomName: string;
	createdAt: Date;
	owner: IUserChannel;
	messages: IMessage[] | null;
	users: IUserChannel[];
	avatar: string | null;
	isPassword: boolean;
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
  changeParam: (param: string, channelId: number, userId : number, content: Date | null) => void;
  sendMessage: (message: IMessage[]) => void;
  leaveChannel: (channelId: number) => void;
  sendUserChannels: (channelId: number, users: IUserChannel[]) => void;
}

interface ClientToServerEventsChat {
  searchChannel: (title: string, callback: (channels: ISearchChannel[]) => void) => void;
  sendMessage: (channelId: number, content: string) => void;
  sendUserOfChannels: (channelId: number, callback: (channels: IUserChannel[]) => void) => void;
  sendMessagesOfChannels: (channelId: number, callback: (channels: IMessage[]) => void) => void;
  searchUsersByTitle: (data: {title: string, channelId: number}, callback: (UserChannel: IUserChannel[]) => void) => void;
  searchUsers: (data: {title: string}, callback: (UserChannel: IUserChannel[]) => void) => void;
}

/// Friend events
interface ServerToClientEventsFriend {
  requestReceived: () => void;
  requestAccepted: () => void;
  requestDeclined: () => void;
  friendshipEnded: () => void;
}
interface ClientToServerEventsFriend {}

// Common
export interface ServerToClientEvents
	extends 
		ServerToClientEventsOnline,
    ServerToClientEventsChat,
    ServerToClientEventsFriend
{
	error: (error: any) => void;
}

export interface ClientToServerEvents
  extends ClientToServerEventsOnline,
  ClientToServerEventsChat,
  ClientToServerEventsFriend
{

}

export interface InterServerEvents {}

export interface SocketData {
  userId: number;
}