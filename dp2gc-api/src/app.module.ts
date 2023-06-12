import {Module,MiddlewareConsumer} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {EventsModule} from './events/events.module';
import { CorsMiddleware } from './cors.middleware';

@Module({
	controllers: [AppController],
	imports: [EventsModule],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorsMiddleware).forRoutes('*');
	  }
}
