import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class EditRankDto{
    
    @IsInt()
    @Max(10)
    @Min(1)
    @IsOptional()
    rank?:number

    @IsOptional()
    @IsString()
    explanation?:string
}