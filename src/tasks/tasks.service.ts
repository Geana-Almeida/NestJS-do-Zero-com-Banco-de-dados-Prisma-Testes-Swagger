import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Query } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { NotFoundError } from 'rxjs';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';


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
    throw new NotFoundException("Tarefa não existe")
  }

  async CreateTask(createTaskDto: CreateTaskDto) {
    const newTask = await this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        completed: false,
      }
    })

    return newTask;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: { id: id }
      })

      if (!findTask) {
        throw new NotFoundException("Task não encontrada.")
      }

      const task = await this.prisma.task.update({
        where: { id: id },
        data: updateTaskDto
      })

      return task;
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Falha ao deletar essa tarefa.");
    }
  }

  async delete(id: number) {
    try {
      const findTaks = await this.prisma.task.findFirst({
        where: {
          id: id
        }
      })

      if (!findTaks) {
        throw new NotFoundException("Task não encontrada.")
      }

      await this.prisma.task.delete({
        where: {
          id: id
        }
      })

      return { message: "Tarefa deletada com sucesso!" }
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Falha ao deletar essa tarefa.");
    }
  }


}
