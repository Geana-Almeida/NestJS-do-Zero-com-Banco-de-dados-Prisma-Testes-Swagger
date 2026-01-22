/*
  DTO -> Data Transfer Object (Objeto de Transferência de Dados)
  Validar dados, transformar dados.
  Se usa para representar quais dados e em que formatos uma determinada camada aceita e trabalha
*/
import { IsNotEmpty, IsString, Min, MinLength } from "class-validator";

 

export class CreateTaskDto{
  @IsString({ message: "O nome deve ser um texto" })
  @MinLength(5, { message: "O nome deve ter no mínimo 5 caracteres" })
  @IsNotEmpty({ message: "O nome é obrigatório" })
  readonly name: string;

  @IsString()
  @MinLength(10, { message: "A descrição deve ter no mínimo 10 caracteres" })
  readonly description: string;
}