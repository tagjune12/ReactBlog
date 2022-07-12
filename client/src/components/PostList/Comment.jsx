import React from 'react';

const CommentHeader = ({ nickname, date }) => {
  return (
    <div className="header">
      <span className="username">{nickname}</span>
      {/* <span className="edit">수정</span>
      <span className="delete">삭제</span> */}
      <span className="date">{date}</span>
    </div>
  );
};

const CommentBody = ({ content }) => {
  return <div className="body">{content}</div>;
};

const CommentFooter = ({ reply, like }) => {
  return (
    <div>
      <span className="reply">{reply}</span>
      <span className="likes">{like.length}</span>
    </div>
  );
};

const Comment = ({
  comment: { author, content, like, postId, publishedDate, reply, _id },
}) => {
  return (
    <div className="comment">
      {/* <div className="image-area">이미지</div> */}
      <div className="content-area">
        <CommentHeader nickname={author.nickname} date={publishedDate} />
        <CommentBody content={content} />
        <CommentFooter reply={reply} like={like} />
      </div>
    </div>
  );
};

export default Comment;
