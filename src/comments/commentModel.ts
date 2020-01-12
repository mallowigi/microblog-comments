import { connect }                                                  from 'mongoose';
import * as mongoosePaginate                                        from 'mongoose-paginate';
import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

connect(`${MONGODB_URL}/comments`, { useNewUrlParser: true });

const CommentSchema = createSchema({
  content:   Type.string({ required: true }),
  authorId:  Type.string({ required: true }),
  articleId: Type.string({ required: true }),
});

CommentSchema.plugin(mongoosePaginate);

// Exports
export type CommentDocument = ExtractDoc<typeof CommentSchema>;
export type CommentProps = ExtractProps<typeof CommentSchema>;
export const CommentModel = typedModel('Comment', CommentSchema);
