export interface UserLog  {
	username: string,
	password: string
};

export interface UserUp  {
	username: string,
	email: string,
	password: string
};

export interface State  {
	userId: string,
	token: string,
	tokenExpiration: string
};

export interface FetchData  {
	method: string,
	body: string,
	headers: Headers
};