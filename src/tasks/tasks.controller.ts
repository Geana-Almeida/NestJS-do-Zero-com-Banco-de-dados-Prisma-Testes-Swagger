import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";
import { TokenPayLoadParam } from "src/auth/param/token-payload-param";
import { PayloadTokenDto } from "src/auth/dto/payload-token.dto";

@Controller('tasks')
export class TasksController{
  constructor(
    private readonly tasksService: TasksService,
  ) {} 
  

  @Get()
  findAllTasks(@Query() paginationDto: PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }


  @Get(":id")
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return this.tasksService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @TokenPayLoadParam() tokenPayload : PayloadTokenDto
  ) {
    return this.tasksService.CreateTask(createTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(":id")
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @TokenPayLoadParam() tokenPayLoad: PayloadTokenDto
  ) {
    return this.tasksService.update(id, updateTaskDto, tokenPayLoad);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(":id")
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayLoadParam() tokenPayLoad: PayloadTokenDto
){
    return this.tasksService.delete(id, tokenPayLoad)
  }
}