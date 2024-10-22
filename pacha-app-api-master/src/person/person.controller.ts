import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IPersonService } from './interfaces/person.interfaces';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AtGuard } from 'src/utils/guards';
import { CreatePersonDto } from './dto/create-person.dto';
import { diskStorage } from 'multer';
import { DeletePersonsDto } from './dto/delete-people.dto';
@Controller(Routes.PERSON)
export class PersonController {
  constructor(
    @Inject(Services.PERSON) private readonly personService: IPersonService,
  ) {}
  @UseGuards(AtGuard)
  @Post('create')
  @UseInterceptors(
    FilesInterceptor('docs', 5, {
      storage: diskStorage({
        destination: './uploads/docs',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreatePersonDto,
  ) {
    const filePath = files?.map(
      (file) => `${process.env.API_BASE_URL}/person/docs/${file.filename}`,
    );

    const person = await this.personService.create({
      ...body,
      docs: filePath,
    });

    return person;
  }
  @Get('docs/:filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      'docs',
      filename,
    );
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  }

  @Get()
  async getPersons(
    @Query('page') page: number = 1,
    @Query('search') search?: string,
    @Query('CNIMan') CNIMan?: string,
    @Query('CNIWoman') CNIWoman?: string,
    @Query('sort') sort?: string,
    @Query('perPage') perPage: number = 10,
  ) {
    const sortArray = sort?.split('.');
    const isSorting = Array.isArray(sortArray);
    const result = await this.personService.find(
      page,
      { search, CNIMan, CNIWoman },
      isSorting ? sortArray[0] : 'id',
      isSorting ? (sortArray[1] as 'asc' | 'desc') : 'desc',
      perPage,
    );

    return result;
  }

  @UseGuards(AtGuard)
  @Delete('delete-many')
  @HttpCode(HttpStatus.OK)
  async deleteMany(@Body() deletePersonsDto: DeletePersonsDto) {
    const result = await this.personService.deletePersons(deletePersonsDto);
    return result;
  }
}
