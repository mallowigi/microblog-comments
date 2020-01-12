import { CommentsController } from '@mallowigi/comments/src/comments/comments.controller';
import { CommentsService }    from '@mallowigi/comments/src/comments/comments.service';
import { Module }             from '@nestjs/common';

@Module({
  imports:     [],
  controllers: [CommentsController],
  providers:   [CommentsService],
})
export class AppModule {}
