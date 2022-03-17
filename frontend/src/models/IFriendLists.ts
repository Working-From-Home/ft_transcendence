export interface IFriend {
	id: number;
	username: number;
}

export interface IFriendLists {
	friends: IFriend[];
	pendings: IFriend[];
	sent: IFriend[];
}