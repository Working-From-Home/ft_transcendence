// doc:
// https://socket.io/docs/v4/typescript/

// https://www.google.com/search?q=socket.io+chat+architecture+events&client=firefox-b-d&channel=crow5&sxsrf=AOaemvKbJlNdKGbMk-FajDgzTqcJ2nd40Q:1639941187336&source=lnms&tbm=isch&sa=X&ved=2ahUKEwj7orH_yPD0AhWKyoUKHfxCA4AQ_AUoAXoECAEQAw&biw=2560&bih=1355&dpr=1

interface IUser
{
  id: number;
  username: string;
  level: number;
  victory: number;
  losses: number;
  connected: boolean; // ca va direct dans user ?
  inGame: boolean; // ca va direct dans user ?
}

// interface IFriend extends IUser
// {
//   connected: boolean; // ca va direct dans user ?
//   inGame: boolean; // ca va direct dans user ?
// }

// interface IChannelUser extends IUser2
// {
//   isOwner: boolean;
//   isAdmin: boolean;
//   muteUntil: Date | null;
//   bannedUntil?: Date | null; // probably useless, because banned user are ejected from the channel.
//   // isFriend?: boolean; // usefull or not ? (from a frontend point of vue)
// }

interface IChannelMessage
{
  userId: number;
  content: string; // maybe another type if we want to keep emoji (utf8)  (maybe of type buffer)
  createdAt: Date;
}

interface IChannel
{
  id: number;
  owner: number;
  admins: number[];
  title: string;
  isDm: boolean;
  isPublic: boolean;
  createdAt: Date;
  users: number[];
  mutedUsers: {userId: number, until: Date}[];
  messages: IChannelMessage[];
}



// I dont have ideas for events name, help please

// events send only from server side
interface ServerToClientEvents {
  ////////////////////////////////////////////////////////////////
  // friends events
  ////////////////////////////////////////////////////////////////
  notifyFriendUpdate: (userId: number) => void;
  notifyFriendDelete: (userId: number) => void;

  ////////////////////////////////////////////////////////////////
  // users events
  ////////////////////////////////////////////////////////////////
  notifyUserUpdate: (user: IUser) => void;
  notifyUserdelete: (userId: number) => void;  

  ////////////////////////////////////////////////////////////////
  // pending events
  ////////////////////////////////////////////////////////////////
  notifyFriendRequest2: (userId: number) => void;

  ////////////////////////////////////////////////////////////////
  // channels events 
  ////////////////////////////////////////////////////////////////

  notifyChannelUpdate2: (channel: IChannel) => void;
  notifyChannelRemove2: (channelId: number) => void;

  notifyChannelUserJoined: (channelId: number, userId: number) => void;
  notifyChannelUserLeaved: (channelId: number, userId: number) => void;
 /** Event who broadcast messages received on the server side to other users in the channel :
  *   - it will find the channel in "myChannels", and push the message to is
  *   - like "notifyFriendUpdate", it can also be used to send all messages of each channel a client is in at login. (just a loop)
  */
  notifyChannelMessage2: (channelId: number, message: IChannelMessage) => void; // maybe not string if we keep emoji...

  ////////////////////////////////////////////////////////////////
  // games events 
  ////////////////////////////////////////////////////////////////
  /** ???
   *  need to:
   *    - matchmaking
   *    - ask a user to play with
   *    - play the actual game
   *    - see live games (so obtaining updates of ongoing games ) 
   */

}

// events send only from server side
interface ClientToServerEvents {

  ////////////////////////////////////////////////////////////////
  // channels events 
  ////////////////////////////////////////////////////////////////
  /** I'm not certain about the channelId (we can't trust user input, help ! Maybe just a if(canSendMessagesToChannel) in the backend side event handler of "sendMessage" ) */
  sendMessage2: (channelId: number, content: string) => void; // maybe not string if we keep emoji...

  ////////////////////////////////////////////////////////////////
  // games events 
  ////////////////////////////////////////////////////////////////

}

// events who can be send from both sides
interface InterServerEvents {

}

interface SocketData {
  /** Id of currently logged user */
  id: number;
}

// in vue store (Maybe the use of dictionary is easier ? something like myChannels[channelId] = theChannelObject )
var users: IUser[]; // all users
var friends: number[]; // all my friends
var myPendings: number[]; // all my pending requests
var blockedUsers: number[]; // all users I have bloqued ? usefull only if we filter messages in the front. (to avoid to filter the emit(notifyChannelMessage) in the server side )
var myChannels: IChannel[]; // all Channels i'm in
var liveGames: any[]; // type ???
