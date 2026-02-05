import { ConsoleLogger, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
  ) { }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        status: true
      },
      select: {
        name: true,
        email: true,
        Task: true
      }
    })

    if (user) {
      return user
    }

    throw new HttpException('Usuário não encontrado', 404);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(createUserDto.password);

      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        }
      })

      return user;
    } catch (error) {
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, payloadTokenDto: PayloadTokenDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id, 
          status: true
        }
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (user.id !== payloadTokenDto.sub) {
        throw new UnauthorizedException('Acesso Negado');
      }

      const dataUser: { name?: string, passwordHash?: string } = {
        name: updateUserDto.name ? updateUserDto.name : user.name,
      }

      if (updateUserDto.password) {
        const passwordHash = await this.hashingService.hash(updateUserDto.password);
        dataUser['passwordHash'] = passwordHash;
      }

      const updateUser = await this.prisma.user.update({
        where: {
          id: id
        },
        data: {
          name: dataUser.name,
          passwordHash: dataUser?.passwordHash ? dataUser.passwordHash : user.passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      return updateUser;
    } catch (error) {
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }



  }

  async delete(id: number, payloadTokenDto: PayloadTokenDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
          status: true
        }
      })

      if (!user) throw new HttpException("Usuário não encontrado", 404);

      if (user.id !== payloadTokenDto.sub) {
        throw new UnauthorizedException("Acesso Negado")
      }

      await this.prisma.user.delete({
        where: {
          id: id
        }
      })

      return { message: `Usuário ${user.name} deletado com sucesso` }
    } catch (error) {
      console.log(error)
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }

  }
}
