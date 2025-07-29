import { Injectable, NotFoundException } from '@nestjs/common';
import { Book, GetBookFilterDto, Language } from './entity/books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



@Injectable()
export class BooksService {

   constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book> 
   ){}
   

   async createBook(data: CreateBookDto): Promise<Book> {
  const book = this.bookRepository.create(data);
  return await this.bookRepository.save(book);
}

   async findBook(filterBookDto:GetBookFilterDto){
        const {search, author, publicationDate, language}= filterBookDto
        const query = this.bookRepository.createQueryBuilder('book')

        if (search){
            const filteredBooks =  query.andWhere('LOWER(book.title) LIKE :search or LOWER(book.author', {search:`%${search.toLowerCase()}%`},)
            return filteredBooks
        }
     if (author) {
    query.andWhere('LOWER(book.author) = :author', { author: author.toLowerCase() });
  }

  if (publicationDate) {
    query.andWhere('book.publicationDate = :publicationDate', { publicationDate });
  }

  if (language) {
    query.andWhere('book.language = :language', { language });
  }

  return await query.getMany();
    }

   async findBookByid(id:number):Promise<Book>{
        const book = await this.bookRepository.findOneBy({id})
        if (!book){
         throw new NotFoundException(`Book with id ${id} was not found!`)

        }

        return book
    }
    
    async updateBook(bookId:number, data:UpdateBookDto):Promise<Book>{
        // const book = this.books.find(book=>book.id === bookId)
        //  if (!book){
        //  throw new NotFoundException(`Book with id ${bookId} was not found!`)

        // }

        const book = await this.findBookByid(bookId)
        Object.assign(book, data)
        return book
    }
    async deleteBook(bookId:number):Promise<{message:string}>{
        const bookIndex = await this.bookRepository.delete(bookId)
      if(!bookId){

          throw new NotFoundException(`book with id ${bookId} is not found!`)
      }
      return {message:`Book successfully deleted with id ${bookId}`}
    }
    
}
