import React from "react";
import { styled } from "styled-components";

const AlbumReview = () => {
  return (
    <StAlbumReviewBox>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        댓글달기
        <input type="text" />
      </form>
    </StAlbumReviewBox>
  );
};

export default AlbumReview;

const StAlbumReviewBox = styled.div`
  width: 95%;
  height: 300px;
  border: 1px solid rgba(255, 100, 0, 0.2);
  margin: 10px auto;
`;
