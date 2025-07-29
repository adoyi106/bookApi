import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { Language } from 'src/books/entity/books.entity';

@Injectable()
export class LanguageValidationPipe implements PipeTransform {
  transform(value: CreateBookDto, metadata: ArgumentMetadata) {
    const languageValue= value.language
    const supportedLanguages = [Language.ENGLISH, Language.FRENCH]
       if (!supportedLanguages.includes(languageValue)){
        throw new BadRequestException("Language not supported")
       }
    return value;
  }
}
