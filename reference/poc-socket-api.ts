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
}

interface IFriend extends IUser
{
  connected: boolean; // ca va direct dans user ?
  inGame: boolean; // ca va direct dans user ?
}

interface IUserChannel extends IUser
{
  isOwner: boolean;
  isAdmin: boolean;
  muteUntil: Date | null;
  bannedUntil?: Date | null; // probably useless, because banned user are ejected from the channel.
  isFriend?: boolean; // usefull or not ? (from a frontend point of vue)
}

interface IChannelMessage
{
  userId: number;
  content: string; // maybe another type if we want to keep emoji (utf8)
  createdAt: Date;
}

interface IChannel
{
  id: number;
  title: string;
  isDm: boolean;
  isPublic: boolean;
  createdAt: Date;
  users: IUserChannel[];
  messages: IChannelMessage[];
}

interface IMessage
{
  id: number;
  content: string; // maybe not of type string if we keep emojis (maybe of type buffer)
  createdAt?: Date;
}

// I dont have ideas for events name, help please

// events send only from server side
interface ServerToClientEvents {
  ////////////////////////////////////////////////////////////////
  // friends events
  ////////////////////////////////////////////////////////////////
  /** Used to update friends vue store list, emits happen when:
   *  - a pending request is accepted (from both sides)
   *  - when any property change (online, in game, etc)
   * can also be used on connexion to send all friends ? (just a loop who send n events) */
  notifyFriendUpdate: (friend: IFriend) => void;
  
  /** Used when a friend remove another friend from his friendlist (via rest) (both will receive the notification ? )
   *    - it will remove the friend from the vue store friends list */
  notifyFriendDelete: (userId: number) => void;

  ////////////////////////////////////////////////////////////////
  // users events (really usefull ? thoses events broadcast to all connected users)
  ////////////////////////////////////////////////////////////////
  /** Used to update users list in vue store when:
   *  - a user create his account
   *  - when any property change (online, in game, the stats etc)
   * can also be used on connexion to send all friends ? (just a loop who send n events) */
  notifyUserUpdate: (user: IUser) => void;
  
  /** Used when a user account is deleted (either by admins or )
   *    - it will remove the friend from the vue store friends list */
  notifyUserdelete: (userId: number) => void;
  
  
  
  ////////////////////////////////////////////////////////////////
  // pending events
  ////////////////////////////////////////////////////////////////
  /** Used when someone get an invite from another user:
   *  - it just push to the payload to the list "myPendings"  */
  notifyFriendRequest: (friend: IUser) => void;
  
  ////////////////////////////////////////////////////////////////
  // channels events 
  ////////////////////////////////////////////////////////////////
  /** Used to notify a client when:
   *    - the user join a channel (the join is via rest api but notif is send via socket right ? it can also be sent into the http response, but we will need this event anyway to emit all clients when some properties changes)
   *    - or when properties of a channel is updated (title, isPublic, other ? )
   * Any update (new user ?) will resend the updated channel[payload.id] = payload (use dictionary ?) https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript?rq=1
   * what about messages ? (see below)
   */
  notifyChannelUpdate: (channel: IFriend) => void;
  /** Event probably totally useless
   *
   * , when a user leave (via rest api), if the code is sucessfull, then just remove, the channel from the list "myChannels" (in vue store)
   */
  notifyChannelRemove: (channelId: number) => void;

  ////////// maybe thoses two are useless, and we send an entire "channelUpdate" when a user join, leave, is kicked, or banned ?
  /** send to all clients in the room's channel when someone join
   *    - just add the new user in the vue store list -> channel[payload.channeId].users.push(payload.user) (use dictionary ? channel[payload.channeId].users[payload.user.id](payload.user))
   */
  notifyChannelUserJoined: (channelId: number, user: IUserChannel) => void;
  /** Send when a user quit, has been kicked, or banned. right ?*/
  notifyChannelUserLeaved: (channelId: number, user: IUserChannel) => void;
 /** Event who broadcast messages received on the server side to other users in the channel :
  *   - it will find the channel in "myChannels", and push the message to is
  *   - like "notifyFriendUpdate", it can also be used to send all messages of each channel a client is in at login. (just a loop)
  */
  notifyChannelMessage: (channelId: number, message: IMessage) => void; // maybe not string if we keep emoji...

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
  sendMessage: (channelId: number, content: string) => void; // maybe not string if we keep emoji...

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
var users: IUser; // all users, really usefull to have the list of users ? (main advantage, is having online, and inGame not only for friends)
var friends: IFriend; // all my friends
var myPendings: IUser; // all my pending requests
var blockedUsers: IUser; // all users I have bloqued ? usefull only if we filter messages in the front. (to avoid to filter the emit(notifyChannelMessage) in the server side )
var myChannels: IChannel; // all Channels i'm in
var liveGames: any; // type ???