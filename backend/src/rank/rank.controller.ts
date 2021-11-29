import { Controller, Get, NotImplementedException } from '@nestjs/common';

@Controller('rank')
export class RankController {
	
	@Get()
	async getUserRank(){
		throw new NotImplementedException()
	}
}
