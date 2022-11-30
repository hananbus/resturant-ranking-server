import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrEditResturantDto{
    @IsString()
    @IsNotEmpty()
    name:string
}