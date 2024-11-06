import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est obligatoire.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom de famille est obligatoire.' })
  lastName: string;

  @IsString()
  @IsOptional({ message: "La carte d'identité de l'homme est obligatoire." })
  CNIMan: string;

  @IsString()
  @IsOptional({ message: "La carte d'identité de la femme est obligatoire." })
  CNIWoman: string;
}
