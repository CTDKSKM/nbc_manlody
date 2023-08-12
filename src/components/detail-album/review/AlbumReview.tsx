import React, { useState } from 'react';
import { styled } from 'styled-components';
import { useParams } from 'react-router-dom';
import useUser from '../../../hooks/useUser';
import Loading from '../../Loading';
import ReviewBox from './ReviewBox';
import useReview from '../../../hooks/useReview';
import Error from '../../Error';

const AlbumReview = () => {
  const { album_id: albumId } = useParams();
  const { userId, userName } = useUser();
  const [content, setContent] = useState<string>('');
  const { isLoading, isError, data, commentMutation } = useReview(albumId!);

  if (isError) return <Error />;

  return (
    <StAlbumReviewContainer>
      <StAlbumReviewForm
        onSubmit={(e) => {
          e.preventDefault();
          const newComment: ReviewCommentData = {
            userId,
            userName,
            content,
            createdAt: new Date().getTime(),
            isUpdated: false,
            albumId: albumId!
          };
          commentMutation.mutate(newComment);
          setContent('');
        }}
      >
        <input
          type="text"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <button>Write</button>
      </StAlbumReviewForm>
      {isLoading ? <Loading /> : <ReviewBox data={data} />}
    </StAlbumReviewContainer>
  );
};

export default AlbumReview;

const StAlbumReviewContainer = styled.div`
  padding: 20px 0px;
`;
const StAlbumReviewForm = styled.form`
  z-index: 0;
  position: relative;
  display: flex;
  justify-content: center;
  gap: 10px;
  > input {
    width: 93%;
    padding: 10px 10px;
    outline: none;
    border-radius: 7px;
    background: #eee;
    border: none;
  }
  button {
    width: 9%;
    background: #eee;
    border: none;
    border-radius: 7px;

    color: gray;
    border: none;
    &:hover {
      // background-color: rgba(128, 128, 128, 0.6);
      color: rgba(128, 128, 128, 0.6);
    }
  }
`;
