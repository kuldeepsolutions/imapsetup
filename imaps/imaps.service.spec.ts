import { Test, TestingModule } from '@nestjs/testing';
import { ImapsService } from './imaps.service';

describe('ImapsService', () => {
  let service: ImapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImapsService],
    }).compile();

    service = module.get<ImapsService>(ImapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
