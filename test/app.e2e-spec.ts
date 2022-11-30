import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test} from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from "pactum";
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateOrEditResturantDto } from '../src/resturant/dto';
import { CreateRankDto, EditRankDto } from 'src/rank/dto';

describe('App e2e',()=> {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({whitelist:true}));
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(()=>{
    app.close();
  });
  describe('Auth', () =>{
    const dto: AuthDto = {
      email: "hanan@gmail.com",
      password: 'secret',
    };  
    describe('Signup', () =>{
      it('Should throw error if email is empty', () => {
        return pactum.spec().post('/auth/signup').withBody({password:dto.password}).expectStatus(400);
      });
      it('Should throw error if password is empty', () => {
        return pactum.spec().post('/auth/signup').withBody({email:dto.email}).expectStatus(400);
      });
      it('Should throw error if the body is empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('Should signup', ()=> {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
      });
      it('Should throw error if email is already exist', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(403);
      });
      it('Should signup', ()=> {
        return pactum.spec().post('/auth/signup').withBody({...dto, email:"hanan2@gmail.com" }).expectStatus(201);
      });
    });
    describe('Signin', ()=> {
      it('Should throw error if email is empty', () => {
        return pactum.spec().post('/auth/signin').withBody({password:dto.password}).expectStatus(400);
      });
      it('Should throw error if password is empty', () => {
        return pactum.spec().post('/auth/signin').withBody({email:dto.email}).expectStatus(400);
      });
      it('Should throw error if the body is empty', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('Should throw error if email doesnt exist', ()=> {
        return pactum.spec().post('/auth/signin').withBody({email: "none@gmail.com", password:dto.password}).expectStatus(403);
      });
      it('Should throw error if password doesnt match', ()=> {
        return pactum.spec().post('/auth/signin').withBody({email: dto.email, password:"wrongSecret"}).expectStatus(403);
      });
      it('Should signin', () => {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'access_token');
      });
      it('Should signin', () => {
        return pactum.spec().post('/auth/signin').withBody({...dto, email:"hanan2@gmail.com" }).expectStatus(200).stores('AlternateUser', 'access_token');
      });
    });
  });
  describe('User', ()=>{
    describe('Get me', () => {
      it('Should get current user', ()=>{
        return pactum.spec().get('/user/me').withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(200);
      });
      it('Shouldnt get current user token doesnt match', ()=>{
        return pactum.spec().get('/user/me').withHeaders({Authorization: 'Bearer dfsfs'}).expectStatus(401);
      });
    });
    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName: "Hanan",
        lastName: "Buskila",
      }
      it('Should edit user', () => {
        return pactum.spec().patch('/user').withHeaders({Authorization: 'Bearer $S{userAt}'}).withBody(dto).expectStatus(200)
        .expectBodyContains(dto.firstName).expectBodyContains(dto.lastName);
      });
      it('Shouldnt edit user, because email already exist', () => {
        return pactum.spec().patch('/user').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody({email:"hanan2@gmail.com" , firstName:dto.firstName}).expectStatus(403);
      });
    });
  });
  describe('Resturant', ()=>{
    describe('Create Resturant', ()=>{
      const dto: CreateOrEditResturantDto ={
        name: "Pizza4p"
      }
      it("Shouldnt create resturant", ()=>{
        return pactum.spec().post('/resturant/create').withBody(dto).expectStatus(401);
      });
      it("Should create resturant", ()=>{
        return pactum.spec().post('/resturant/create').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody(dto).expectStatus(201).stores('resturantId', 'id');
      });
    });
    describe('Edit Resturant', ()=> {
      const dto: CreateOrEditResturantDto ={
        name: "Pizza4p2"
      }
      it("Should edit the resturant" , ()=>{
        return pactum.spec().patch('/resturant/edit/{id}').withPathParams('id', '$S{resturantId}').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody(dto).expectStatus(200);
      });
      it("Shouldnt edit the resturant, user isnt admin" , ()=>{
        return pactum.spec().patch('/resturant/edit/{id}').withPathParams('id', '$S{resturantId}').withHeaders({Authorization: 'Bearer $S{AlternateUser}'})
        .withBody(dto).expectStatus(403);
      });
      it("Shouldnt edit the resturant, body without name" , ()=>{
        return pactum.spec().patch('/resturant/edit/{id}').withPathParams('id', '$S{resturantId}').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody({}).expectStatus(400);
      });
    });
    describe('Get Resturants',()=>{
      const dto: CreateOrEditResturantDto ={
        name: "Burgers"
      }
      it("Shoult get all resturant (length: 1)", ()=>{
        return pactum.spec().get('/resturant/all').expectStatus(200).expectJsonLength(1);
      });
      it("Should create resturant", ()=>{
        return pactum.spec().post('/resturant/create').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody(dto).expectStatus(201).stores("ResturantId2", "id");
      });
      it("Shoult get all resturant (length: 2)", ()=>{
        return pactum.spec().get('/resturant/all').expectStatus(200).expectJsonLength(2);
      });
    });
    describe("Get Resturant By Id", ()=>{
      it("Should get a resturant (name Pizza4p2)", ()=>{
        return pactum.spec().get('/resturant/{id}').withPathParams('id', '$S{resturantId}')
        .expectStatus(200).expectBodyContains("Pizza4p2");
      });
    });
    describe("Delete Resturant", ()=>{
      it("delete resturant by id", ()=>{
        return pactum.spec().delete('/resturant/{id}').withPathParams('id', '$S{resturantId}')
        .withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(204);
      });
      it("Shoult get all resturant (length: 1)", ()=>{
        return pactum.spec().get('/resturant/all').expectStatus(200).expectJsonLength(1);
      });
    });
  });
  describe('Rank', ()=>{
    describe('createRank', ()=>{
      const dto:CreateRankDto ={
        resturantName: "Burgers",
        rank: 9,
        explanation:"great resturant, best pizza in the city!"
      }
      it("Should create rank", ()=>{
        return pactum.spec().post('/rank/create').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody(dto).expectStatus(201).stores('rankId', 'id');
      });
      it("Shouldnt create rank, resturant doesnt exist", ()=>{
        return pactum.spec().post('/rank/create').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody({...dto , resturantName: "Pizza4p2"}).expectStatus(403);
      });
      it("Shouldnt create rank, number to high", ()=>{
        return pactum.spec().post('/rank/create').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody({...dto , rank: 11}).expectStatus(400);
      });
      it("Shouldnt create rank, number to low", ()=>{
        return pactum.spec().post('/rank/create').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody({...dto , rank: 0}).expectStatus(400);
      });
      it("Should create rank", ()=>{
        return pactum.spec().post('/rank/create').withHeaders({Authorization: 'Bearer $S{AlternateUser}'})
        .withBody({...dto, rank:8}).expectStatus(201).stores("AlternateUserRankId","id");
      });
    });
    describe('getAllRanks', ()=>{
      it("Should retrun all ranks",()=>{
        return pactum.spec().get('/rank/all').expectStatus(200).expectJsonLength(2);
      });
    });
    describe('getUserRanks', ()=>{
      it("Should get all user ranking (length 1)" , ()=>{
        return pactum.spec().get('/rank/myRanks').expectStatus(200).withHeaders({Authorization: 'Bearer $S{userAt}'}).expectJsonLength(1);
      });
      it("Should create resturant", ()=>{
        return pactum.spec().post('/resturant/create').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody({name:"Jappanica"}).expectStatus(201);
      });
      it("Should create rank", ()=>{
        return pactum.spec().post('/rank/create').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody({resturantName:"Jappanica", rank:8}).expectStatus(201);
      });
      it("Should get all user ranking (length 2)" , ()=>{
        return pactum.spec().get('/rank/myRanks').expectStatus(200).withHeaders({Authorization: 'Bearer $S{userAt}'}).expectJsonLength(2);
      });
    });
    describe('editRank', ()=>{
      const dto: EditRankDto = {
        rank: 7,
        explanation:"the resturant is fine"
      }
      it("Should edit rank", ()=>{
        return pactum.spec().patch('/rank/edit/{id}').withPathParams('id', '$S{rankId}').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody(dto).expectStatus(200).expectBodyContains(dto.rank).expectBodyContains(dto.explanation);
      });
      it("Shouldnt edit rank, not ranked by same user", ()=>{
        return pactum.spec().patch('/rank/edit/{id}').withPathParams('id', '$S{AlternateUserRankId}').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody(dto).expectStatus(403);
      });
    });
    describe('getRankById', ()=>{
      it("Should get rank by id", ()=>{
        return pactum.spec().get('/rank/{id}').withPathParams('id', '$S{rankId}')
        .expectStatus(200).expectBodyContains("Burgers");
      });

    });
    describe('Get Resturant Ranks (Burgers)',()=>{
      it('Should get all resturant ranking',()=>{
        return pactum.spec().get('/rank/resturantRanking/{resturantId}').withPathParams('resturantId', "$S{ResturantId2}")
        .expectStatus(200).expectJsonLength(2);
      });
      it("Should create rank", ()=>{
        return pactum.spec().post('/rank/create').withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody({resturantName:"Burgers", rank:5}).expectStatus(201);
      });
      it('Should get all resturant ranking',()=>{
        return pactum.spec().get('/rank/resturantRanking/{resturantId}').withPathParams('resturantId', "$S{ResturantId2}")
        .expectStatus(200).expectJsonLength(3);
      });
    });
    describe('deleteRank', ()=>{
      it("delete rank by id", ()=>{
        return pactum.spec().delete('/rank/{id}').withPathParams('id', '$S{rankId}')
        .withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(204);
      });
    });
  })

});
