import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CacheService } from './cache.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [CacheService],
})
export class AppModule {}
