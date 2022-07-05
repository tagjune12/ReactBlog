import '@styles/editor.scss';

import React, { useState, useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { writePost } from '@lib/api/post';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { modifyPost } from '@modules/modify';
import Button from './common/Button';

// 글 제목 작성
const EditorHead = ({ content }) => {
  const [title, setTitle] = useState(content.current.title);
  const onChange = (event) => {
    content.current.title = event.target.value;
    setTitle(event.target.value);
    // console.log(content.current.title);
  };

  // useEffect(() => {
  //   console.log(title);
  // }, [title]);

  return (
    <>
      {content.current.title ? (
        <input
          className="title-input"
          placeholder="제목"
          value={content.current.title}
          onChange={onChange}
        />
      ) : (
        <input className="title-input" placeholder="제목" onChange={onChange} />
      )}
    </>
  );
};

// 글 내용 작성
const EditorBody = ({ content, className }) => {
  const navigation = useNavigate();
  const editorInstance = useRef(null);
  const editorContainer = useRef(null);

  const dispatch = useDispatch();
  const params = useParams();
  const { loading, post } = useSelector(({ modify }) => modify);

  useEffect(() => {
    editorInstance.current = new Quill(editorContainer.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['image', 'link', 'video'],
        ],
      },
      placeholder: '내용을 입력하세요',
    });
    editorInstance.current.focus();
    const quillEditor = editorInstance.current;
    // console.log('content확인', content.current);
    if (content.current['content']) {
      // console.log(content.current);
      quillEditor.root.innerHTML = content.current['content'];
    }

    quillEditor.on('text-change', (delta, oldContent, source) => {
      if (source === 'user') {
        content.current['content'] = quillEditor.root.innerHTML;
      }
    });
  }, [content.current]);

  const onWriteBtnClick = (event) => {
    event.preventDefault();
    writePost(content.current).then((response) => {
      const postId = response.data._id;
      navigation(`/post/${postId}`);
    });
  };

  const onModifyBtnClick = (event) => {
    event.preventDefault();
    dispatch(modifyPost(params.id, content.current));
    if (!loading) {
      navigation(`/post/${params.id}`);
    }
  };

  return (
    <>
      <div ref={editorContainer} />
      <div className="editor-btn-wrapper">
        {className === 'modify' ? (
          <Button onClick={onModifyBtnClick}>수정 완료</Button>
        ) : (
          <Button onClick={onWriteBtnClick}>작성</Button>
        )}
        <Button
          className="cancel-btn"
          onClick={(event) => {
            event.preventDefault();
            navigation(-1);
          }}
        >
          취소
        </Button>
      </div>
    </>
  );
};

// 본 컴포넌트
const Editor = ({ className, content }) => {
  return (
    <div className="write-form">
      {/* <br />
      <br /> */}
      <form>
        <EditorHead className={className} content={content} />
        <EditorBody className={className} content={content} />
      </form>
    </div>
  );
};

export default Editor;
