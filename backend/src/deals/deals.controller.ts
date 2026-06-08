import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './create-deal.dto';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  findAll() {
    return this.dealsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dealsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDealDto) {
    return this.dealsService.create(dto);
  }

  @Post(':id/join')
  join(@Param('id', ParseIntPipe) id: number) {
    return this.dealsService.join(id);
  }
}
