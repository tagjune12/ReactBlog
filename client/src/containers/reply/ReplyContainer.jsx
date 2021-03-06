import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { remove } from '@lib/api/reply';
import { initialize } from '@modules/replies/writeReply';
import { useDispatch } from 'react-redux';

import Reply from '../../components/reply/Reply';
import ReplyEditorContainer from './ReplyEditorContainer';

const ReplyContainer = ({ reply }) => {
  const [isMyReply, setIsMyReply] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(({ user }) => user);

  const onRemoveBtnClick = () => {
    const replyId = reply?._id;
    console.log('click Remove Reply');
    if (window.confirm('정말 댓글을 삭제하시겠습니까?')) {
      try {
        remove(replyId).then((response) => {
          if (response.status === 204) console.log('삭제 완료');
        });
      } catch (e) {
        alert('리플을 삭제하는데 오류가 발생했습니다.');
        throw e;
      }
    }
  };

  const onEditBtnClick = () => {
    console.log('click Edit Reply');
    const { content, _id: replyId } = reply;
    dispatch(
      initialize({
        content,
        replyId,
      }),
    );
    setIsModifying(true);
  };

  useEffect(() => {
    const { author } = reply;
    setIsMyReply(author?._id === user?._id);
  }, []);

  return (
    <>
      {isModifying ? (
        <ReplyEditorContainer type="modify" setWriteReply={setIsModifying} />
      ) : (
        <Reply
          reply={reply}
          onRemoveBtnClick={onRemoveBtnClick}
          onEditBtnClick={onEditBtnClick}
          isMyReply={isMyReply}
        />
      )}
    </>
  );
};

export default ReplyContainer;
