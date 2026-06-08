import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateDealDto {
  @IsIn(['group-buy', 'delivery', 'taxi-share', 'carpool'])
  type: 'group-buy' | 'delivery' | 'taxi-share' | 'carpool';

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  originalPrice?: number;

  @IsOptional()
  @IsNumber()
  groupPrice?: number;

  @IsNumber()
  targetParticipants: number;

  @IsString()
  deadline: string;

  @IsString()
  organizer: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  departureTime?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsNumber()
  minOrderAmount?: number;

  @IsOptional()
  @IsString()
  externalLink?: string;
}
