import { IsArray, IsBoolean, IsIn, IsOptional, IsUrl } from 'class-validator';
import { APP_EVENTS } from '../../cv/config/events.config';

const VALID_EVENTS = Object.values(APP_EVENTS);

export class CreateWebhookDto {
  @IsUrl()
  url: string;

  @IsArray()
  @IsIn(VALID_EVENTS, { each: true })
  events: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
