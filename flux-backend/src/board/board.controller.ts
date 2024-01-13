import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../common/shared/decorators/userId.decorator';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @UserId() user_id: string,
  ) {
    createBoardDto.user_id = user_id;
    return this.boardService.create(createBoardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@UserId() user_id: string) {
    return this.boardService.list(user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @UserId() user_id: string) {
    return this.boardService.findOne(id, user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @UserId() user_id: string,
  ) {
    return this.boardService.update(id, updateBoardDto, user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @UserId() user_id: string) {
    return this.boardService.delete(id, user_id);
  }
}
