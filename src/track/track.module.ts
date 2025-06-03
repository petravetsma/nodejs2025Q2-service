import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { Track } from 'src/track/entities/track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
