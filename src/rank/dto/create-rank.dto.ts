import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateRankDto{
    @IsString()
    @IsNotEmpty()
    resturantName: string

    @IsInt()
    @Max(10)
    @Min(1)
    @IsNotEmpty()
    rank:number

    @IsOptional()
    @IsString()
    explanation?:string
}