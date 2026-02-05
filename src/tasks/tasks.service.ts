import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Query, UnauthorizedException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { NotFoundError } from 'rxjs';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';


@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const allTasks = await this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        id: 'asc'
      }
    });
    return allTasks;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id
      }
    });

    if (task) return task;

    //throw new HttpException("Tarefa não existe", HttpStatus.NOT_FOUND);
    throw new NotFoundException("")
  }

  async CreateTask(createTaskDto: CreateTaskDto, tokenPayload: PayloadTokenDto) {
    try {
      const newTask = await this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        completed: false,
        userId: tokenPayload.sub
      }
    })

    return newTask;
    } catch (error) {

      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, tokenPayLoad: PayloadTokenDto) {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: { id: id }
      })

      if (!findTask) {
        throw new NotFoundException("Task não encontrada.")
      }

      if(findTask.userId !== tokenPayLoad.sub){
        throw new UnauthorizedException("Acesso Negado!")
      }

      const task = await this.prisma.task.update({
        where: { id: id },
        data: {
          name: updateTaskDto.name ? updateTaskDto.name : findTask.name,
          description: updateTaskDto.description ? updateTaskDto.description : findTask.description,
          completed: updateTaskDto.completed ? updateTaskDto.completed : findTask.completed,
        }
      })

      return task;
    } catch (error) {
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }
  }

  async delete(id: number, tokenPayLoad: PayloadTokenDto) {
    try {
      const findTaks = await this.prisma.task.findFirst({
        where: {
          id: id
        }
      })

      if (!findTaks) {
        throw new NotFoundException("Task não encontrada.")
      }

      if(findTaks.userId !== tokenPayLoad.sub){
        throw new UnauthorizedException("Acesso Negado!")
      }

      await this.prisma.task.delete({
        where: {
          id: id
        }
      })

      return { message: "Tarefa deletada com sucesso!" }
    } catch (error) {
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }
  }


}
