import { Controller, Get, Query } from '@nestjs/common';
import dayjs from 'dayjs';

import { EventsService } from './events.service';

type ImportRangeString = '1q' | '2q' | '3q' | '4q' | '1q_and_2q' | '3q_and_4q';

class ImportRange {
    range: ImportRangeString;
    constructor(range: ImportRangeString) {
        this.range = range;
    }

    getRange(year: number): [dayjs.Dayjs, dayjs.Dayjs] {
        const _1q_start = dayjs(`${year}-4-1`);
        const _2q_start = dayjs(`${year}-6-10`);
        const _3q_start = dayjs(`${year}-9-1`);
        const _4q_start = dayjs(`${year}-11-25`);
        const _1q_end = dayjs(`${year}-6-9`);
        const _2q_end = dayjs(`${year}-8-31`);
        const _3q_end = dayjs(`${year}-11-24`);
        const _4q_end = dayjs(`${year + 1}-3-1`).subtract(1, 'day');

        if (this.range == '1q') return [_1q_start, _1q_end];
        else if (this.range == '2q') return [_2q_start, _2q_end];
        else if (this.range == '3q') return [_3q_start, _3q_end];
        else if (this.range == '4q') return [_4q_start, _4q_end];
        else if (this.range == '1q_and_2q') return [_1q_start, _2q_end];
        else if (this.range == '3q_and_4q') return [_3q_start, _4q_end];
        // throw new Error('Invalid range');
        return [_3q_start, _4q_end]; // for debug
    }
}

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Get()
    async getList(
        @Query('username') username: string,
        @Query('password') password: string,
        @Query('importYear') importYear: number,
        @Query('importRange') importRange: ImportRangeString,
    ): Promise<string> {
        const importRangeObj = new ImportRange(importRange);
        const [start, end] = importRangeObj.getRange(importYear);

        console.log('username', username);
        console.log('password', password);
        console.log('year', importYear, start);
        console.log('range', importRange, end);

        return await this.eventsService.getList(username, password, start, end);
    }
}
