import React, { useState } from "react";
import { styled } from "styled-components";
import { useParams } from "react-router-dom";
import useUser from "../../../hooks/useUser";
import Loading from "../../Loading";
import ReviewBox from "./ReviewBox";
import useReview from "../../../hooks/useReview";
import Error from "../../Error";

const AlbumReview = () => {
  const { album_id: albumId } = useParams();
  const { userId, userName } = useUser();
  const [content, setContent] = useState<string>("");
  const { isLoading, isError, data, commentMutation } = useReview(albumId!);

  if (isError) return <Error />;

  return (
    <StAlbumReviewContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newComment: ReviewCommentData = {
            userId,
            userName,
            content,
            createdAt: new Date().getTime(),
            isUpdated: false,
            albumId: albumId!,
          };
          commentMutation.mutate(newComment);
          setContent("");
        }}
      >
        댓글달기
        <input
          type="text"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </form>
      {isLoading ? <Loading /> : <ReviewBox data={data} />}
    </StAlbumReviewContainer>
  );
};

export default AlbumReview;

const StAlbumReviewContainer = styled.div`
  width: 95%;
  height: 300px;
  border: 1px solid rgba(255, 100, 0, 0.2);
  margin: 10px auto;
`;
