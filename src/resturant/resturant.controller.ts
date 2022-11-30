import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateOrEditResturantDto } from './dto';
import { ResturantService } from './resturant.service';

@Controller('resturant')
export class ResturantController {
    constructor(private resturantService: ResturantService){}

    @UseGuards(JwtGuard)
    @Post('create')
    createResturant(@GetUser('id') userId:number, @Body() dto:CreateOrEditResturantDto ){
        return this.resturantService.createResturant(dto, userId);
    }
    
    @UseGuards(JwtGuard)
    @Patch('edit/:id')
    editResturant(@Param('id', ParseIntPipe) resturntId:number,@GetUser('email') email: string,@Body() dto:CreateOrEditResturantDto){
        return this.resturantService.editResturant(resturntId,email,dto);
    }


    @Get('all')
    getResturants(){
        return this.resturantService.getResturants();
    }

    @Get(':id')
    getResturantById(@Param('id', ParseIntPipe) resturntId:number){
        return this.resturantService.getResturantById(resturntId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtGuard)  
    @Delete(':id')
    deleteResturant(@Param('id', ParseIntPipe) resturntId:number,@GetUser('email') email:string ){
        return this.resturantService.deleteResturant(resturntId,email);
    }
}
