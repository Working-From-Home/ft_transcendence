// doc:
// https://socket.io/docs/v4/typescript/

// https://www.google.com/search?q=socket.io+chat+architecture+events&client=firefox-b-d&channel=crow5&sxsrf=AOaemvKbJlNdKGbMk-FajDgzTqcJ2nd40Q:1639941187336&source=lnms&tbm=isch&sa=X&ved=2ahUKEwj7orH_yPD0AhWKyoUKHfxCA4AQ_AUoAXoECAEQAw&biw=2560&bih=1355&dpr=1

interface IUser 
{
    id: number;
    username: string;
    //etc
}

interface IFriend extends IUser
{
    connected: boolean;
    inGame: boolean;
}

interface IUserChannel extends IUser
{
  isOwner: boolean;
  isAdmin: boolean;
  endMute: Date | null;
  // endBan: Date | null; // may not be needed, because banned user are not in the channel anymore.
  isFriend: boolean; // usefull or not ? (from a frontend point of vue)
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
    createdAt: Date;
    users: IUserChannel[];
}


// I dont have ideas for events name, help please
// (j'ai du mal aussi a faire le lien entre les rooms et les events...)

// events send only from server side
interface ServerToClientEvents {
// examples:
//   noArg: () => void;
//   basicEmit: (a: number, b: string, c: Buffer) => void;
//   withAck: (d: string, callback: (e: number) => void) => void;

/** Used to notify a client when a channel is updated.
 * Any update (new user ?) will resend the updated channel.
 * what about messages ?
 */
  notifyChannelUpdate: (channel: IFriend) => void;

  /** to update channels list in frontend */
  notifyUserJoinedChannel: (user: IUserChannel) => void;
  /** When a user quit, has been kicked, or banned. right ?*/
  notifyUserLeavedChannel: (user: IUserChannel) => void;

  /** Used to update the friend list in frontend 
   * used when a pending request is accepted, and when a friend login and logout,
   * or a user change inGame status
   * can also be used on connexion to send all friends ?
   * pb: what happen when a friend is deleted ? a new event deleteFriend ? */
  notifyFriendUpdate: (friend: IFriend) => void;
  /** yes or no ? (just to notify the client side to remove the friend from list */
  notifyFriendDelete: (userId: number) => void;
}

// events send only from server side
interface ClientToServerEvents {
// examples:
  // hello: () => void;

  /** I'm not certain about the channelId (we can't trust user input, help ! ) */
  sendMessage: (channelId: number, content: string) => void; // maybe not string if we keep emoji...
}

// events who can be send from both sides
interface InterServerEvents {
// examples:
// ping: () => void;

}


interface SocketData {
  /** Id of currently logged user */
  id: number;
}
