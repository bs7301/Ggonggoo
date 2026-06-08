import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './deal.entity';
import { CreateDealDto } from './create-deal.dto';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
  ) {}

  async findAll(): Promise<Deal[]> {
    return this.dealRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Deal> {
    const deal = await this.dealRepo.findOneBy({ id });
    if (!deal) {
      throw new NotFoundException(`Deal #${id} not found`);
    }
    return deal;
  }

  async create(dto: CreateDealDto): Promise<Deal> {
    const deal = this.dealRepo.create({
      ...dto,
      currentParticipants: 1, // 생성자가 자동으로 첫 참여자
      status: 'active',
    });
    return this.dealRepo.save(deal);
  }

  async join(id: number): Promise<Deal> {
    const deal = await this.findOne(id);

    if (deal.status !== 'active') {
      throw new NotFoundException('This deal is no longer active');
    }

    deal.currentParticipants += 1;

    if (deal.currentParticipants >= deal.targetParticipants) {
      deal.status = 'completed';
    }

    return this.dealRepo.save(deal);
  }
}
