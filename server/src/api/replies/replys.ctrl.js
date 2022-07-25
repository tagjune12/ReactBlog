import Joi from 'joi';
import Reply from '../../models/reply';
import { mongoose } from 'mongoose';
import Comment from '../../models/comment';

const { ObjectId } = mongoose.Types;
export const getReplyById = async (ctx, next) => {
  const { id } = ctx.request.params;
  if (!ObjectId.isValid(id)) {
    ctx.response.status = 400; // Bad Request
    return;
  }

  try {
    const reply = await Reply.findById(id);
    // 댓글이 존재하지 않을 때
    if (!reply) {
      ctx.response.status = 404;
      return;
    }

    ctx.state.reply = reply;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }

  return next();
}

// 자신이 쓴 답글인지 확인
export const checkOwnReply = (ctx, next) => {
  const { user, reply } = ctx.state;

  if (reply.author._id.toString() !== user._id) {
    ctx.response.status = 403; // Forbidden
    return;
  }

  return next();
}


// GET /api/replies?comment=
// 답글 리스트 가져오기
export const list = async ctx => {
  const comment = ctx.request.query.commentId;
  const query = {
    ...comment
  };

  try {
    const replies = await Reply.find(query).sort({
      _id: -1
    })
      .lean()
      .exec();
    ctx.response.body = replies;
  } catch (e) {
    ctx.throw(500, e);
  }
};

// POST /api/replies/:id
// 답글 작성
/*
  {
    content
  }
*/
export const write = async ctx => {
  const schema = Joi.object().keys({
    content: Joi.string().required(),
  });

  const validationResult = schema.validate(ctx.request.body);

  if (validationResult.error) {
    ctx.response.status = 400; // Bad Request
    ctx.response.body = validationResult.error;
    return;
  }

  const { content } = ctx.request.body;
  // const reply = new Reply({
  //   commentId: ctx.state.comment._id,
  //   content,
  //   author: ctx.state.user
  // });
  const query = { _id: ctx.state.comment._id };
  const reply = {
    content,
    author: ctx.state.user,
    publishedDate: Date.now
  }
  const updateDocument = {
    $push: {
      reply
    }
  };
  await Comment.updateOne(query, updateDocument);

  // const reply = new Reply({
  //   commentId: ctx.state.comment._id,
  //   content,
  //   author: ctx.state.user
  // });
  // await Comment.findByIdAndUpdate(ctx.state.comment._id, {
  //   reply: ctx.state.comment.reply + 1
  // }, { new: true }).exec();

  try {
    // await reply.save();
    ctx.response.body = reply;
  } catch (e) {
    ctx.throw(500, e);
  }
}

// DELETE /api/replies/:id ==> 여기서 id는 답글 id임
// 답글 삭제
export const remove = async ctx => {
  const { id } = ctx.request.params;
  try {
    await Reply.findByIdAndRemove(id).exec();
    ctx.response.status = 204;
  } catch (e) {
    ctx.response.throw(500, e);
  }
}


// PATCH /api/replies/:id ==> 여기서 id는 답글 id임
// 답글 수정
/*
  {
    content
  }
*/
export const update = async ctx => {
  const schema = Joi.object().keys({
    content: Joi.string().required(),
  });

  const validationResult = schema.validate(ctx.request.body);

  if (validationResult.error) {
    ctx.response.status = 400; // Bad Request
    ctx.response.body = validationResult.error;
    return;
  }

  const { id } = ctx.request.params;
  try {
    const reply = await Reply.findByIdAndUpdate(id, ctx.request.body, {
      new: true
    }).exec();
    ctx.response.body = reply;
  } catch (e) {
    ctx.throw(500, e);
  }
}