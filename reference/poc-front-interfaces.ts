/////////////////////////////////////////
// Solution one
/////////////////////////////////////////

/**
 * pros:
 *   - all in one list, no dupplicate data send by sockets.
 * 
 * cons:
 *   - need some helper functions for example to get friends from user list given a set of Ids
 * 
 * Pb:
 *   - how to bind data to the ui ?
 */

interface User
{
  id: number;
  username: string;
  email: string;
  connected: boolean;
  inGame: boolean;
}

interface IUserChannel extends IUser
{
  userId: number;
  isOwner: boolean;
  isAdmin: boolean;
  muteUntil: Date | null;
  Ban: Date | null; // may not be needed, because banned user are not in the channel anymore.
}

interface Channel
{
  id: number;
  title: string;
  createdAt: Date;
  users: IUserChannel[];
}

// in vue store
var users: User[]
var friends: number[] // ids
var pending: number[] // ids of users who send me a request
var channels: Channel[]

/////////////////////////////////////////
// Solution two
/////////////////////////////////////////