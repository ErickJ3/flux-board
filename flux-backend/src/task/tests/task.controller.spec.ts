import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../task.controller';
import { TaskService } from '../task.service';

const taskData = [
  {
    id: 'mock_id',
    title: 'title_mock',
    description: 'desciption_mock',
    status: 'BACKLOG',
    board_id: 'board_id_mock',
    user_id: 'user_id_mock',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const taskToCreateAndUpdate = {
  title: 'title_mock',
  description: 'desciption_mock',
  board_id: 'board_id_mock',
};

const taskId = 'task-id-mock';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn().mockReturnValue(taskData[0]),
            list: jest.fn().mockReturnValue(taskData),
            findOne: jest.fn().mockReturnValue(taskData[0]),
            update: jest.fn().mockReturnValue(taskData[0]),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    expect(await controller.create(taskToCreateAndUpdate)).toEqual(taskData[0]);
  });

  it('should list all tasks', async () => {
    const boardId = 'board-id-mock';
    expect(await controller.findAll(boardId)).toEqual(taskData);
  });

  it('should list all tasks', async () => {
    expect(await controller.findOne(taskId)).toEqual(taskData[0]);
  });

  it('should list all tasks', async () => {
    expect(await controller.update(taskId, { name: 'name_mock' })).toEqual(
      taskData[0],
    );
  });

  it('should delete task', async () => {
    expect(await controller.remove(taskId)).toBeUndefined();
  });
});
