import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotFoundException } from 'src/common/exception';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw UserNotFoundException();
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.findOne(id); // throws if not found
    await this.userRepo.update(id, data);
    return this.userRepo.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id); // throws if not found
    await this.userRepo.delete(id);
  }
}
