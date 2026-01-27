import { ConsoleLogger, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where:{
        id: id
      },
      select: {
        name: true,
        email: true,
        Task: true
      }
    })

    if(user){
      return user
    }

    throw new HttpException('Usuário não encontrado', 404);
  }

  async create(createUserDto: CreateUserDto){
    try {
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: createUserDto.password,
        },
        select: {
          id: true,
          name: true,
          email: true,
        }
      })

      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException("Erro ao criar usuário", 500)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto){
    try {
      const user = await this.prisma.user.findFirst({
      where: {
        id: id
      }
    });

    if(!user){
      throw new NotFoundException('Usuário não encontrado');
    }

    const updateUser = await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        name: updateUserDto.name ? updateUserDto.name : user.name,
        passwordHash: updateUserDto.password ? updateUserDto.password : user.passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
      
    return updateUser;
    } catch (error) {
      console.log(error);
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
        if (error instanceof HttpException) {
    throw error;
  }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }
    
    
    
  }

  async delete(id: number){
    try {
      const user = await this.prisma.user.findFirst({
      where: {
        id: id
      }
    })

    if(!user) throw new HttpException("Usuário não encontrado", 404);

    await this.prisma.user.delete({
      where: {
        id: id
      }
    })

    return { message: `Usuário ${user.name} deletado com sucesso`}
    } catch (error) {
      console.log(error);
      throw new HttpException("Erro ao deletar usuário", 500)
    }
    
  }
}
