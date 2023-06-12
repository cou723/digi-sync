import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {EventsModule} from './events/events.module';

@Module({
	controllers: [AppController],
	imports: [EventsModule],
	providers: [AppService],
})
export class AppModule {}
