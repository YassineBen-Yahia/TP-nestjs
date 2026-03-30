import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateCvDto {

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

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  skillIds?: number[];
}