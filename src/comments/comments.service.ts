import { CommentDocument, CommentModel } from '@mallowigi/comments/src/comments/commentModel';
import {
  CreateCommentRequest,
  CreateCommentResponse,
  GetCommentRequest,
  IComment,
  ICommentsService,
  ListCommentsRequest,
  logger,
  RemoveCommentRequest,
  RemoveCommentResponse,
  RemoveCommentsRequest,
  RemoveCommentsResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
}                                        from '@mallowigi/common';
import { Injectable }                    from '@nestjs/common';
import { from, Observable }              from 'rxjs';

const defaultParams = {
  query:      {},
  pagination: {
    limit: 10,
    page:  1,
  },
};

@Injectable()
export class CommentsService implements ICommentsService {
  public async list(req: ListCommentsRequest): Promise<Observable<CommentDocument>> {
    const { query, pagination } = (
      req || defaultParams
    );

    try {
      const response = await CommentModel.paginate(query, pagination);
      return from(response.docs as CommentDocument[]);
    }
    catch (error) {
      const message = 'could not fetch comments';
      logger.error({
        message,
        payload: { query, pagination },
      });
      throw Error(message);
    }
  }

  public async create(req: CreateCommentRequest): Promise<CreateCommentResponse<CommentDocument>> {
    const { authorId, content, articleId } = req;

    try {
      const comment = new CommentModel({ authorId, content, articleId });
      await comment.save();

      return { comment };
    }
    catch (error) {
      const message = 'could not create comment';
      logger.error({
        error,
        message,
        payload: { authorId, content, articleId },
      });
      throw Error(message);
    }
  }

  public async get({ id }: GetCommentRequest): Promise<IComment> {
    try {
      return await CommentModel.findOne({ _id: id });
    }
    catch (e) {
      const message = 'could not get comment';
      logger.error({
        message,
        payload: { id },
      });
      throw Error(message);
    }
  }

  public async remove({ id }: RemoveCommentRequest): Promise<RemoveCommentResponse<CommentDocument>> {
    try {
      const query = { _id: id };
      const comment = await CommentModel.findOne(query);
      comment.remove();

      return {
        comment,
        ok: true,
      };
    }
    catch (e) {
      const message = 'could not remove comment';
      logger.error({
        message,
        payload: { id },
      });
      throw Error(message);
    }
  }

  public async update({ id, content }: UpdateCommentRequest): Promise<UpdateCommentResponse<CommentDocument>> {
    try {
      const query = { _id: id };
      const comment = await CommentModel.findOne(query);

      await CommentModel.findOneAndUpdate(query, { content });

      return { comment };
    }
    catch (e) {
      const message = 'could not update comment';
      logger.error({
        message,
        payload: { id },
      });
      throw Error(message);
    }
  }

  public async removeComments({ articleId }: RemoveCommentsRequest): Promise<RemoveCommentsResponse<CommentDocument>> {
    try {
      const comments = await CommentModel.find({ articleId });
      await CommentModel.deleteMany({ articleId });

      logger.info(`${comments.length} comment deleted`);
      return {
        comments,
        ok: true,
      };
    }
    catch (e) {
      const message = 'could not remove comments';
      logger.error({
        message,
        payload: { articleId },
      });
      throw Error(message);
    }
  }
}
