import { Test, TestingModule } from '@nestjs/testing';
import { ImapsController } from './imaps.controller';

describe('ImapsController', () => {
  let controller: ImapsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImapsController],
    }).compile();

    controller = module.get<ImapsController>(ImapsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
