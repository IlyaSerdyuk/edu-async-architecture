import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'edu_tasks',
      password: 'edu_tasks',
      database: 'edu_tasks',
      synchronize: true,
    }),
  ],
})
export class AppModule {}
