import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import useReview from '../../../hooks/useReview';
import 'firebase/firestore';
import CreatedTime from './CreatedTime';
import { PlusSquareFilled } from '@ant-design/icons';

type Props = {
  userId: string;
  comment: ReviewCommentData;
  changeListener: number;
};

const Review = ({ comment, userId, changeListener }: Props) => {
  const { deleteMutation, updateMutation } = useReview();
  const [isOptBoxShow, setIsOptBoxShow] = useState<boolean>(false);
  const [isInputBoxShow, setIsInputBoxShow] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(comment.content);
  const updateInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (updateInputRef.current && isInputBoxShow) updateInputRef.current.focus();
  }, []);

  const showUpdateInput = () => {
    setIsInputBoxShow(!isInputBoxShow);
  };
  const deleteComment = () => {
    deleteMutation.mutate(comment.docId!);
  };
  const submitUpdateComment = () => {
    const newComment: ReviewCommentData = {
      ...comment,
      content: newContent,
      isUpdated: !comment.isUpdated
    };
    updateMutation.mutate(newComment);

    setIsInputBoxShow(false);
  };

  const optBtnRef = useRef(null);
  const handleWindowClick = (e: MouseEvent) => {
    if (e.target !== optBtnRef.current) setIsOptBoxShow(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleWindowClick);
  }, []);

  return (
    <StReview>
      <div key={comment.docId} className="comment-div">
        <div className="name">{comment.userName}</div>
        {isInputBoxShow ? (
          <form
            className="input-box"
            onSubmit={(e) => {
              e.preventDefault();
              submitUpdateComment();
            }}
          >
            <input
              ref={updateInputRef}
              type="text"
              value={newContent}
              onChange={(e) => {
                setNewContent(e.target.value);
              }}
            />
            <button>수정</button>
            <button
              onClick={() => {
                setIsInputBoxShow(false);
              }}
            >
              취소
            </button>
          </form>
        ) : (
          <span className="content">{comment.content}</span>
        )}
        <div className="date">
          <CreatedTime createdAt={comment.createdAt} isUpdated={comment.isUpdated} changeListener={changeListener} />
          {comment.userId === userId && (
            <StOptionBox>
              <div
                ref={optBtnRef}
                className="option-btn"
                onClick={() => {
                  setIsInputBoxShow(false);
                  setIsOptBoxShow(!isOptBoxShow);
                }}
              >
                ...
              </div>
              {isOptBoxShow && (
                <div className="select-box">
                  <div onClick={showUpdateInput}>수정하기</div>
                  <div onClick={deleteComment}>삭제하기</div>
                </div>
              )}
            </StOptionBox>
          )}
        </div>
      </div>
    </StReview>
  );
};

export default Review;
const StReview = styled.div`
  margin: 0 auto;

  .comment-div {
    border-bottom: dotted 1px #eee;
    border-radius: 8px;
    padding: 20px 10px;
    display: flex;
    position: relative;
    align-items: center;
    margin: 10px auto;
    transition: background-color 0.7s;
    &:hover {
      background-color: rgba(218, 218, 218, 0.5);
      filter: blur(0.5px);
      backdrop-filter: blur(8px);
      opacity: 0.94;

      font-weight: 600;
    }
    .name {
      width: 15%;
    }
    .input-box {
      width: 50%;
    }
    input {
      border: none;
      border-radius: 4px;
      padding: 8px;
    }
    .content {
      width: 50%;
      position: relative;
    }
    .date {
      width: 7%;
    }
  }
  button {
    margin: 0 10px;
  }
`;
const StOptionBox = styled.div`
  .option-btn {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    top: 50%;
    width: 3%;
    cursor: pointer;
    transform: translateY(-100%);
  }
  .select-box {
    position: absolute;
    right: 30px;
    top: -10px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    background-color: white;
    padding: 10px 30px 10px 10px;
    border-radius: 14px 50% 50% 14px;
    clip-path: polygon(0 0, 81% 0, 81% 38%, 100% 48%, 81% 55%, 81% 100%, 0 100%);
  }
`;
