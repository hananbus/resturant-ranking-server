import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateRankDto, EditRankDto } from './dto';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
    constructor(private rankService: RankService){}

    @Get('all')
    getAllRanks(){
        return this.rankService.getAllRanks();
    }

    @UseGuards(JwtGuard)
    @Post('create')
    createRank(@GetUser('id') userId: number  ,@Body() dto:CreateRankDto){
        return this.rankService.createRank(userId,dto);
    }

    @UseGuards(JwtGuard)
    @Patch('edit/:id')
    editRank(@Param('id', ParseIntPipe) rankId:number,@GetUser('id') userId: number, @Body() dto:EditRankDto){
        return this.rankService.editRank(rankId,userId, dto);
    }

    @UseGuards(JwtGuard)
    @Get('myRanks')
    getUserRanks(@GetUser('id') userId: number){
        return this.rankService.getUserRanks(userId);
    }

    @Get(':id')
    getRankById(@Param('id', ParseIntPipe) rankId:number){
        return this.rankService.getRankById(rankId);
    }

    @Get("/resturantRanking/:resturantId")
    gerResturnatRanking(@Param('resturantId', ParseIntPipe) resturntId: number){
        return this.rankService.getResturantRanking(resturntId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtGuard)
    @Delete(':id')
    deleteResturant(@Param('id', ParseIntPipe) rankId:number,@GetUser('id') userId: number ){
        return this.rankService.deleteRank(rankId,userId);
    }


}
