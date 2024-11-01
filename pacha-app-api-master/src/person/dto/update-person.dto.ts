import { IsString, IsOptional } from 'class-validator';

export class UpdatePersonDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  CNIMan?: string;

  @IsString()
  @IsOptional()
  CNIWoman?: string;
}
