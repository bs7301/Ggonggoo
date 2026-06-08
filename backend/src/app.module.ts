import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './deals/deal.entity';
import { User } from './auth/user.entity';
import { DealsModule } from './deals/deals.module';
import { AuthModule } from './auth/auth.module';
import { seedDeals } from './deals/seed';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db.sqlite',
      entities: [Deal, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Deal]),
    DealsModule,
    AuthModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
  ) {}

  async onModuleInit() {
    const count = await this.dealRepo.count();
    if (count === 0) {
      for (const dealData of seedDeals) {
        const deal = this.dealRepo.create(dealData);
        await this.dealRepo.save(deal);
      }
      console.log(`✅ Seeded ${seedDeals.length} deals`);
    }
  }
}
