export interface State  {
	userId: string,
	username: string,
	email: string,
	avatar: string
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