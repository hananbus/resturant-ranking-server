import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async editUser(userId:number , dto: EditUserDto) {
        if(dto.email){
            const mailExist = await this.prisma.user.findFirst({
                where: {
                    email: dto.email,
                },
            });
            if(mailExist)
                throw new ForbiddenException('Email Already Taken!');
        }
        const user = await this.prisma.user.update({
            where: {
                id:userId,
             },
            data: {
                ...dto, 
            },
        });
        delete user.hash;
        return user;
    }
}
