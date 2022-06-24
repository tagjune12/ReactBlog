import React from 'react';

const PostHeader = ({ postInfo }) => {
  return (
    <div className="header">
      <h3 className="title">{postInfo.title}</h3>
      <div className="post-info">
        <span className="author">{postInfo.title}</span>
        <span className="date">{postInfo.date}</span>
        <span className="comments">{postInfo.numOfComments} </span>
        <span className="likes">{postInfo.like} </span>
      </div>
    </div>
  );
};

const PostBody = ({ content }) => {
  return <div className="body">{content}</div>;
};

const Post = ({ post }) => {
  const postHeader = {
    title: post?.title,
    author: post?.author,
    date: post?.publishedDate,
    numOfComments: post?.comments.length,
    like: post?.like,
  };
  const postBody = post?.content;
  return (
    <div className="post">
      <PostHeader postInfo={postHeader} />
      <PostBody content={postBody} />
    </div>
  );
};

export default Post;