import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  icon: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  color: number;

  @IsBoolean()
  @Transform(({ value }: TransformFnParams) => value === 'true' || value === true)
  public: boolean;
}
