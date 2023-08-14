import React from 'react';
import { styled } from 'styled-components';
import useUser from '../../../hooks/useUser';
import Review from './Review';

type Props = {
  data: ReviewCommentData[] | undefined;
};

const ReviewBox = ({ data }: Props) => {
  const { userId } = useUser();
  return (
    <ReviewWrapper>
      <div id="comment-wrapper">
        {data?.map((comment) => {
          return <Review key={comment.docId} userId={userId} comment={comment} changeListener={data.length} />;
        })}
      </div>
    </ReviewWrapper>
  );
};

export default ReviewBox;

const ReviewWrapper = styled.div`
  height: 156px;

  #comment-wrapper {
    position: relative;
    z-index: 8;
    padding: 0 10px;
    margin-top: 10px;
    max-height: 330px;
    width: 95%;
    overflow-y: scroll;
  }
`;
