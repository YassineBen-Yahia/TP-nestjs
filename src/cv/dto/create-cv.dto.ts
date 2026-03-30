import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
export class AddCvDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @Type(() => Number )
  @IsNumber()
  @Min(15)
  @Max(70)
  age: number;

  @IsNotEmpty()
  @Type(() => Number )
  @IsNumber()
  cin: number;

  @IsNotEmpty()
  @IsString()
  job: string;

  @IsOptional()
  @IsString()
  path: string;
}