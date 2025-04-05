import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, DefaultValuePipe } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dto/index.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Get('list')
  async getBookList() {
    return this.bookService.getBookList();
  }

  @Get('find')
  async findBookById(@Query('id', new DefaultValuePipe('111')) id: string) {
    console.log("🚀 ~ BookController ~ findBookById ~ id:", id)
    return this.bookService.findBookById(id);
  }

  // @Get('find/:id')
  // async findBookById(@Param('id', new DefaultValuePipe('111')) id: string) {
  //   console.log("🚀 ~ BookController ~ findBookById ~ id:", id)
  //   return this.bookService.findBookById(id);
  // }

  @Post('add')
  async addBook(@Body() bookInfo: CreateBookDto) {
    return this.bookService.addBook(bookInfo);
  }

  @Put('update')
  async updateBook(@Body() bookInfo: UpdateBookDto) {
    return this.bookService.updateBook(bookInfo);
  }

  @Delete('delete/:id')
  async deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }
}
