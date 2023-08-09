import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import useReview from "../../../hooks/useReview";
import "firebase/firestore";
import CreatedTime from "./CreatedTime";
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
    if (updateInputRef.current && isInputBoxShow)
      updateInputRef.current.focus();
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
      isUpdated: !comment.isUpdated,
    };
    updateMutation.mutate(newComment);

    setIsInputBoxShow(false);
  };

  const optBtnRef = useRef(null);
  const handleWindowClick = (e: MouseEvent) => {
    if (e.target !== optBtnRef.current) setIsOptBoxShow(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
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
            ></input>
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
          <CreatedTime
            createdAt={comment.createdAt}
            isUpdated={comment.isUpdated}
            changeListener={changeListener}
          />
        </div>
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
    </StReview>
  );
};

export default Review;
const StReview = styled.div`
  .comment-div {
    border: 1px solid gray;
    display: flex;
    position: relative;
    /* justify-content: space-between; */
    align-items: center;
    margin: 10px auto;

    .name {
      width: 15%;
    }
    .input-box {
      width: 50%;
    }
    .content {
      width: 50%;
      position: relative;
    }
    .date {
      width: 7%;
    }
  }
`;
const StOptionBox = styled.div`
  .option-btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 3%;
    cursor: pointer;
  }
  .select-box {
    position: absolute;
    right: 0;
    top: -50px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }
`;
