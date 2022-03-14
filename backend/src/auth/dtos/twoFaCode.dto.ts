import { IsNotEmpty, IsString } from "class-validator";


export class TwoFaCodeDto {
	@IsString()
	@IsNotEmpty()
	twoFaCode : string
}

export default TwoFaCodeDto;