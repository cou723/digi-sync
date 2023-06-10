import { Controller, Get, Query } from '@nestjs/common';
import { Dayjs as dayjs } from 'dayjs';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    async getList(@Query('username') username: string, @Query('password') password: string, @Query('year') year: string, @Query('month') month: string): Promise<string> {
        // const start = new dayjs();
        // const end = new dayjs();
        return this.eventsService.getList(username, password, start, end);
    }
}
