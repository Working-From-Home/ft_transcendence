export interface IGameSettings {
	speed: number,
	paddleSpeed: number,
	score: number
}

export interface IGameRequest {
	gameSettings: IGameSettings;
	hostId: number;
	guestId: number;
}