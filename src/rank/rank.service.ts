import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRankDto, EditRankDto } from './dto';

@Injectable()
export class RankService {
    constructor(private prisma: PrismaService){}

    async createRank(userId:number, dto:CreateRankDto){
        const resturant = await this.GetResturantByName(dto.resturantName);
        if(!resturant){
            throw new ForbiddenException('resturant doesnt exist');
        }
        const rank = await this.prisma.rank.create({
            data:{
                userId,
                ...dto
            }
        });
        this.updateResturantRank(dto.rank,dto.resturantName);
        return rank;
    }

    async editRank(rankId: number,userId:number, dto:EditRankDto){
        const rank = await this.GetRankById(rankId);
        if(!rank || rank.userId !=userId){
            throw new ForbiddenException('Access to resource denied!');
        }
        this.updateResturantRank(dto.rank, rank.resturantName,rank.rank);
        return this.prisma.rank.update({
            where:{
                id:rankId,
            },
            data:{
                ...dto
            }
        });
    }

    getRankById(rankId: number){
        return this.prisma.rank.findFirst({
            where:{
                id:rankId
            }
        })
    }

    getUserRanks(userId:number){
        return this.prisma.rank.findMany({
            where:{
                userId
            }
        });
    }

    getAllRanks(){
      return this.prisma.rank.findMany();  
    }

    async getResturantRanking(resturantId: number){
        const resturant = await this.prisma.resturant.findUnique({
            where:{
                id:resturantId
            }
        });
        const resturantName = resturant.name;
        return this.prisma.rank.findMany({
            where:{
                resturantName,
            }
        });
    }

    async deleteRank(rankId: number, userId:number){
        const rank = await this.GetRankById(rankId);
        if(!rank || rank.userId !=userId){
            throw new ForbiddenException('Access to resource denied!');
        }
        this.deleteResturantRank(rank.resturantName, rank.rank);
        await this.prisma.rank.delete({
            where: {
                id: rankId
            }
        });
    };

    async deleteResturantRank(resturantName: string , deletedRank:number){
        const resturant = await this.GetResturantByName(resturantName);
        const amountOfRanks = resturant.amountOfRanks - 1;
        const rank = ((resturant.rank*(amountOfRanks + 1))-deletedRank) /amountOfRanks;
        return this.prisma.resturant.update({
            where:{
                name:resturantName
            },
            data:{
                rank,
                amountOfRanks,
            }
        });

    }

    async updateResturantRank(rankScore: number, resturantName: string , oldRank:number = 0){
        const resturant = await this.GetResturantByName(resturantName);
        if(!resturant.rank || resturant.rank === 0){
            return this.prisma.resturant.update({
                where:{
                    name:resturantName
                },
                data:{
                    rank:rankScore,
                    amountOfRanks: 1
                }
            })
        }
        let amountOfRanks = resturant.amountOfRanks;
        let rank :number;
        if(oldRank === 0){
            amountOfRanks = amountOfRanks + 1;
            rank = ((resturant.rank)*(amountOfRanks - 1) + rankScore) / (amountOfRanks);
        }
        else{
            rank = ((resturant.rank)*(amountOfRanks) + rankScore - oldRank) / (amountOfRanks);
        }
        return this.prisma.resturant.update({
            where:{
                name:resturantName
            },
            data:{
                rank,
                amountOfRanks,
            }
        });
    }
    GetResturantByName(resturantName: string){
        return this.prisma.resturant.findFirst({
            where:{
                name: resturantName
            }
        });
    }
    GetRankById(rankId: number){
        return this.prisma.rank.findFirst({
            where: {
                id:rankId,
            }
        });
    }
}
