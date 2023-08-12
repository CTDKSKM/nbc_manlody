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
    <StReviewBox>
      {data?.map((comment) => {
        return <Review key={comment.docId} userId={userId} comment={comment} changeListener={data.length} />;
      })}
    </StReviewBox>
  );
};

export default ReviewBox;

const StReviewBox = styled.div`
  padding: 10px;
  height: 200px;
  overflow: hidden;
  overflow-y: auto;
`;
