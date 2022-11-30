import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrEditResturantDto } from './dto';

@Injectable()
export class ResturantService {
    constructor(private prisma:PrismaService, private config: ConfigService){}
    
    async createResturant(dto: CreateOrEditResturantDto, userId: number){
        if(!userId){
            throw new ForbiddenException('Access to resource denied!');
        }
        const resturant = await this.prisma.resturant.create({
            data:{
                ...dto
            }
        });
        return resturant
    }

    async editResturant(resturantId:number ,email: string ,dto: CreateOrEditResturantDto){
        if(email !== this.config.get('ADMIN')){
            throw new ForbiddenException('Access to resource denied!');
        }
        const resturant = await this.prisma.resturant.findFirst({
            where:{
                id:resturantId
            }
        });
        if(!resturant){
            throw new ForbiddenException('Access to resource denied!');
        }
        return this.prisma.resturant.update({
            where:{
                id: resturantId
            },
            data: {
                ...dto
            }
        });
    }

    getResturants(){
        return this.prisma.resturant.findMany();
    }

    getResturantById(resturantId:number){
        return this.prisma.resturant.findFirst({
            where: {
                id:resturantId
            }
        });
    }

    async deleteResturant(resturantId: number, email:string){
        const resturant = await this.prisma.resturant.findFirst({
            where: {
                id:resturantId,
            }
        });
        if(!resturant || email !== this.config.get('ADMIN')){
            throw new ForbiddenException('Access to resource denied!');
        }
        await this.prisma.resturant.delete({
            where: {
                id: resturantId
            }
        });
    }
}
