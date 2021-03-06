import React, { useEffect } from 'react';
import ReplyList from '@components/reply/ReplyList';
import { useSelector, useDispatch } from 'react-redux';
import { getReplies, unloadReplies } from '@modules/replies/replies';

const ReplyListContainer = ({ commentId }) => {
  // Reply 가져오는 로직
  const { loading, error, replies } = useSelector(({ replies }) => replies);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReplies(commentId));
    // }, [commentId]);

    return () => {
      dispatch(unloadReplies());
    };
  }, []);

  return <ReplyList replies={replies} />;
};

export default ReplyListContainer;
