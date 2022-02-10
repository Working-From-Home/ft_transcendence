export interface IGameSettings {
	speed: number,
	paddleSize: number,
	score: number
}

export interface IGameRequest {
	gameSettings: IGameSettings;
	hostId: number;
	guestId: number;
}