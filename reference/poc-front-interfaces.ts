/////////////////////////////////////////
// Solution one
/////////////////////////////////////////

/**
 * pros:
 *   - all in one list, no dupplicate data send by sockets.
 * 
 * cons:
 *   - need some helper functions for example to get friends from user list given a set of friend Ids
 * 
 * Pb:
 *   - how to bind data to the ui ?
 */
function solutionOne(){ // just to scope interfaces

  interface IUser
  {
    id: number;
    username: string;
    email: string;
    connected: boolean;
    inGame: boolean;
  }

  interface IUserChannel
  {
    userId: number;
    isOwner: boolean;
    isAdmin: boolean;
    muteUntil: Date | null;
    bannedUntil: Date | null; // may not be needed, because banned user are not in the channel anymore.
  }

  interface IChannel
  {
    id: number;
    title: string;
    createdAt: Date;
    users: IUserChannel[];
  }

  // in vue store
  var users: IUser[];
  var friends: number[] // ids of friends
  var pending: number[] // ids of users who send me a request
  var blockedUsers: number[] // ids of users I have blocked
  var channels: IChannel[]
}
/////////////////////////////////////////
// Solution two
/////////////////////////////////////////
function solutionTwo(){ // just to scope interfaces

  interface IUser
  {
    id: number;
    username: string;
    email: string;
    connected: boolean;
    inGame: boolean;
    isBlocked: boolean;
    isFriend: boolean;
    isPending: boolean;
  }

  interface IUserChannel
  {
    userId: number;
    isOwner: boolean;
    isAdmin: boolean;
    muteUntil: Date | null;
    bannedUntil: Date | null; // may not be needed, because banned user are not in the channel anymore.
  }

  interface IChannel
  {
    id: number;
    title: string;
    createdAt: Date;
    users: IUserChannel[];
  }

  // in vue store
  var users: IUser[];
  var friends: number[]; // ids of friends
  var pending: number[]; // ids of users who send me a request
  var blockedUsers: number[]; // ids of users I have blocked
  var channels: IChannel[];
}
/////////////////////////////////////////
// Solution three
/////////////////////////////////////////
function solutionThree(){ // just to scope interfaces

  interface IUser
  {
    id: number;
    username: string;
    email: string;
    connected: boolean; // yes or no ? 
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
    muteUntil: Date | null;
    bannedUntil: Date | null; // may not be needed, because banned user are not in the channel anymore.
  }

  interface IChannel
  {
    id: number;
    title: string;
    createdAt: Date;
    users: IUserChannel[];
  }


  // in vue store
  var users: IUser[]; // ?
  var friends: IFriend[];
  var pending: IUser[];
  var blockedUsers: IUser[];
  var channels: IChannel[];
}

/////////////////////////////////////////
// Solution four
/////////////////////////////////////////

// ?