import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/persistence/prisma.service';
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

const prismaMock = {
  task: {
    create: jest.fn().mockReturnValue(taskData[0]),
    findMany: jest.fn().mockResolvedValue(taskData),
    findUnique: jest.fn().mockResolvedValue(taskData[0]),
    update: jest.fn().mockResolvedValue(taskData[0]),
    delete: jest.fn(),
  },
};

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a task', async () => {
    expect(await service.create(taskToCreateAndUpdate)).toEqual(taskData[0]);
  });

  it('should list tasks', async () => {
    const boardId = 'board-id-mock';
    expect(await service.list(boardId)).toEqual(taskData);
  });

  it('should update a task', async () => {
    const taskId = 'task-id';
    expect(await service.update(taskId, taskData)).toEqual(taskData[0]);
  });

  it('should delete a task', async () => {
    const taskId = 'task-id';
    await expect(service.delete(taskId)).resolves.toBeUndefined();
  });

  it('should find one task', async () => {
    const taskId = 'task-id';
    expect(await service.findOne(taskId)).toEqual(taskData[0]);
  });
});
