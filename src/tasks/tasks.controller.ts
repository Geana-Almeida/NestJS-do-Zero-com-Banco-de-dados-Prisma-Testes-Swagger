import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LoggerInterceptor } from "src/common/interceptors/logger.interceptor";
import { BodyCreateTaksInterceptor } from "src/common/interceptors/body-create-task.interceptor";
import { AddHeaderInterceptor } from "src/common/interceptors/add.header.interceptor";

@Controller('tasks')
@UseInterceptors(LoggerInterceptor) //Interceptor roda antes de chegar no método do controller
export class TasksController{
  constructor(private readonly tasksService: TasksService) {} 
  
  @Get()
  @UseInterceptors(AddHeaderInterceptor)
  findAllTasks(@Query() paginationDto: PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }

  @Get(":id")
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return this.tasksService.findOne(id);
  }

  @Post()
  @UseInterceptors(BodyCreateTaksInterceptor)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.CreateTask(createTaskDto);
  }

  @Patch(":id")
  updateTask(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(":id")
  deleteTask(@Param('id', ParseIntPipe) id: number){
    return this.tasksService.delete(id)
  }
}