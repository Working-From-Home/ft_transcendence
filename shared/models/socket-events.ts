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

export class Game {
    id: number;
    winnerScore: number;
    looserScore: number;
    createdAt: Date;
    looser: User;
    winner: User;
}

export interface Friendship {
    applicantId: number;
    recipientId: number;
    status: "accepted" | "pending";
    createdAt: Date;
    applicant: User;
    recipient: User;
}

export interface Stats {
    userId: number;
    user: User;
    level: number;
    victories: number;
    losses: number;
}

export interface Achievement {
    id: number;
    title: string;
    description: string;
    users: User[];
}

export interface Avatar {
    userId: number;
    user: User;
    filename: string;
    mimetype: string;
    data: Uint8Array;
}

export interface Blocked {
    applicantId: number;
    recipientId: number;
    createdAt: Date;
    applicant: User;
    recipient: User;
}

export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    role: "owner" | "admin" | "user";
    createdAt: Date;
    banned: boolean;
    twoFaEnabled: boolean;
    twoFaSecret: string | null;
    oauthToken: string | null;
    avatar: Avatar;
    stats: Stats;
    achievements: Achievement[];
    sentFriendRequests: Friendship[];
    receivedFriendRequests: Friendship[];
    usersBlocked: Blocked[];
    BlockedBy: Blocked[];
    messages: Message[];
    userChannels: IUserChannel[];
    channels: IChannel[];
    lossedGames: Game[];
    wonGames: Game[];
}

export interface Message {
    _id: number;
    content: string;
    createdAt: Date;
    channel: IChannel;
	senderId: number;
    user: User;
}

export interface IUserChannel {
    userId: number;
    channelId: number;
    role: "admin" | "user";
    mutedUntil: Date | null;
}

export interface IChannel {
	roomId: number;
	isDm: boolean;
	//roomName: string | null;
	createdAt: Date;
	owner: User;
	messages: Message[] | null;
	users: IUserChannel[] | null;
}

/// Online events
interface ServerToClientEventsOnline {
  connectedUsers: (users: { id: number }[]) => void;
  userConnected: (userId: number ) => void;
  userDisconnected: (userId: number ) => void;
  numberOfOnlineUsers: (nbUsers: number ) => void;
}

interface ClientToServerEventsOnline {}

/// Chat events
interface ServerToClientEventsChat {
  sendChannels: (channels: IChannel[]) => void;
  sendUserChannels: (channelId: number, users: IUserChannel[]) => void;
}

interface ClientToServerEventsChat {
  searchChannel: (title: string, callback: (channels: ISearchChannel[]) => void) => void;
  sendMessage: (channelId: number, content: string) => void; // maybe not string if we keep emoji...
  sendUserOfChannels: (channelId: number, callback: (channels: IUserChannel[]) => void) => void;
  sendMessagesOfChannels: (channelId: number, callback: (channels: Message[]) => void) => void;
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