import { IGameStats } from "./IGameStats";

export interface IEndCallback {
	(gameId : string, stats : IGameStats) : void
}