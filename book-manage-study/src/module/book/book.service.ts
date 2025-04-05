import { HttpException, Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Book } from './entities/book.entity';
import { CreateBookDto, UpdateBookDto } from './dto/index.dto';

@Injectable()
export class BookService {

  @Inject()
  private readonly dbService: DbService;

  /**
   * @description 获取书籍列表
   * */
  async getBookList() {
    const books: Book[] = await this.dbService.read();
    return books;
  }

  /**
   * @description 根据id获取书籍详情
   * */
  async findBookById(id: string) {
    const books: Book[] = await this.dbService.read();
    return books.find(book => book.id === id)
  }

  /**
   * @description 添加书籍
   * */
  async addBook(bookInfo: CreateBookDto) {
    const books: Book[] = await this.dbService.read();
    books.forEach(book => {
      if (book.bookName === bookInfo.bookName) {
        throw new HttpException('书籍已存在', 400);
      }
    })
    let book = new Book();
    book.id = Math.floor(Math.random() * 1000000) + Date.now() + '';
    book = {
      ...book,
      ...bookInfo
    }
    books.push(book);
    await this.dbService.write(books);
    return book;
  }

  /**
   * @description 更新书籍
   * */
  async updateBook(bookInfo: UpdateBookDto) { }

  /**
 * @description 删除书籍
 * */
  async deleteBook(id: string) { }
}
