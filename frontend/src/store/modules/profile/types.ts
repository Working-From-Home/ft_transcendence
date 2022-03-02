export interface State  {
	// isMine: boolean,
	userId: string,
	username: string,
	email: string,
	avatar: string,
	level: number,
	victories: number,
	losses: number
};

export interface FetchData  {
	method: string,
	body: string | FormData,
	headers: Headers
};

export interface FData  {
	method: string,
	headers: Headers
};