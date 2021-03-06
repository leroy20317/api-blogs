import {Test, TestingModule} from '@nestjs/testing';
import Controller from './controller';

describe('InfoController', () => {
  let controller: Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Controller],
    }).compile();

    controller = module.get<Controller>(Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
