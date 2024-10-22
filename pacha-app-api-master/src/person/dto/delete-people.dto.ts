import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class DeletePersonsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
