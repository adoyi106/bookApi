import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './entity/books.entity';
import { LanguageValidationPipe } from 'src/common/pipes/language-validation/language-validation.pipe';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';


@Controller('books')
export class BooksController {
 constructor(private readonly bookService: BooksService){}
    @Get()
    findAll(@Query() filterBookDto: GetBookFilterDto){
        return this.bookService.findBook(filterBookDto)
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("admin")
    @UsePipes(LanguageValidationPipe)
    createBook(@Body(new ValidationPipe()) body: CreateBookDto){
      return this.bookService.createBook(body)
    }
    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id:number){
        return this.bookService.findBookByid(id)
    }
    @Patch(":id")
    update(@Param("id") id:string, @Body() body:UpdateBookDto){
        const book = this.bookService.updateBook(+id, body)
        return book
    }
    @Delete(":id")
    delete(@Param("id") id: string){
        return this.bookService.deleteBook(+id)
    }
}
