import { HttpException, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol
  ){}

  async authenticate(signInDto: SignInDto){
    try {
      const user = await this.prisma.user.findFirst({
      where:{
        email: signInDto.email
      }
    })
    
    if(!user){
      throw new HttpException('Credenciais inválidas', 401);
    }

    const passwordIsValid = await this.hashingService.compare(signInDto.password, user.passwordHash);

    if(!passwordIsValid){
      throw new HttpException('Credenciais inválidas', 401);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
    } catch (error) {
      console.log(error);
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
        if (error instanceof HttpException) {
    throw error;
  }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }
    
  }
}
