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
  connected: boolean;
  inGame: boolean;
}

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
  messages: IChannelMessage[]; // maybe not needed if messages are directly pushed into the "advanced chat" ?
}

// I dont have ideas for events name, help please


// events send only from server side
interface ServerToClientEvents {
  ////////////////////////////////////////////////////////////////
  // users events
  ////////////////////////////////////////////////////////////////
  /** send broadcast on creation, or when a user properties change (online, stats, etc)*/ 
  notifyUserUpdated: (user: IUser) => void;
  /** send broadcas when a user is deleted (either himself or by a website admin) */ 
  notifyUserdelete: (userId: number) => void;  

  ////////////////////////////////////////////////////////////////
  // friends events
  ////////////////////////////////////////////////////////////////
  /** send when a friend request is accepted (send to both sides) */
  notifyFriendUpdated: (userId: number) => void;
  /** send when a friend is removed (send to both sides ?) */
  notifyFriendDelete: (userId: number) => void;
  
  ////////////////////////////////////////////////////////////////
  // pending events
  ////////////////////////////////////////////////////////////////
  /** send to the user who received a friendship invite */
  notifyFriendRequest: (userId: number) => void;

  ////////////////////////////////////////////////////////////////
  // channels events 
  ////////////////////////////////////////////////////////////////
  /** send when the channel is updated (title, public, owner, that's it ?) And about the lists inside ? separate events ? like for "notifyChannelMessage" ? (see below)*/
  notifyChannelUpdated: (channel: IChannel) => void;
  /** useless event probably (if rest api return 200, then remove the channel from the list) */
  notifyChannelRemove: (channelId: number) => void;
  /** add the user id in the channel property named 'users' */
  notifyChannelUserJoined: (channelId: number, userId: number) => void;
  /** remove the user id in the channel property named 'users' */
  notifyChannelUserLeaved: (channelId: number, userId: number) => void;  
  /** Event who broadcast messages received on the server side to other users in the channel :
  *   - it will find the channel in "myChannels", and push the message to is
  *   - it can also be used to send all messages of each channel a client is in at login. (just a loop)
  */
  notifyChannelMessage: (channelId: number, message: IChannelMessage) => void;

  // and about other arrays updates ? like that ? :
  notifyChannelMute: (channelId: number, user: {userId: number, until: Date}) => void;
  notifyChannelAdminUpdate: (channelId: number, userId: number) => void;
  notifyChannelAdminDelete: (channelId: number, userId: number) => void;

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
// -> https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript?rq=1
{
      var users: IUser[]; // all users
      // or using a dict
      var usersDict: { [id: number] : IUser; }; // all users stored in a dict by id
      //then
      usersDict[myChannels[0].users[0].id].username;
      usersDict[myPendings[0]].username;
      // etc
      // then to update the user on event "notifyUserUpdated"
    socket.on("notifyUserUpdated")
    {
      usersDict[payload.id] = payload; // and it should also work to send all users at connection (using a loop in the backend to emit N events to the user)
    }
}
var friends: number[]; // all my friends
var myPendings: number[]; // all my pending requests (list of user ids)
var blockedUsers: number[]; // all users I have bloqued ? usefull only if we filter messages in the front. (to avoid to filter the emit(notifyChannelMessage) in the server side )
var myChannels: IChannel[]; // all Channels i'm in
var liveGames: any[]; // type ???

// now, maybe we can separate list for online from IUser or not ? but same for inGame ?
// it adds more events to update thoses lists, and we will still need the "notifyUserUpdated" to update properties, and when a user create his account.
// but in the other hand, it's a little more easier to loop through all online/InGame users.
var onlineUsers: number[];
var inGameUsers: number[];
