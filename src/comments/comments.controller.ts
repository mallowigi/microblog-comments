import { CommentsService }             from '@mallowigi/comments/src/comments/comments.service';
import { LoggingInterceptor }          from '@mallowigi/comments/src/logging.interceptor';
import {
  CreateCommentRequest,
  CreateCommentResponse,
  GetCommentRequest,
  IComment,
  ListCommentsRequest,
  RemoveCommentRequest,
  RemoveCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
}                                      from '@mallowigi/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, GrpcMethod }    from '@nestjs/microservices';
import { Observable }                  from 'rxjs';

@UseInterceptors(LoggingInterceptor)
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
  }

  @GrpcMethod('CommentsService')
  async list(req: ListCommentsRequest): Promise<Observable<IComment>> {
    return await this.commentsService.list(req);
  }

  @GrpcMethod('CommentsService')
  async get(req: GetCommentRequest): Promise<IComment> {
    return await this.commentsService.get(req);
  }

  @GrpcMethod('CommentsService')
  async create(req: CreateCommentRequest): Promise<CreateCommentResponse<IComment>> {
    return await this.commentsService.create(req);
  }

  @GrpcMethod('CommentsService')
  async update(req: UpdateCommentRequest): Promise<UpdateCommentResponse<IComment>> {
    return await this.commentsService.update(req);
  }

  @GrpcMethod('CommentsService')
  async remove(req: RemoveCommentRequest): Promise<RemoveCommentResponse<IComment>> {
    return await this.commentsService.remove(req);
  }

  @EventPattern('ArticleDeletedEvent')
  async articleDeleted({ id: articleId }) {
    return this.commentsService.removeComments(articleId);
  }
}
