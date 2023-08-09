import React from "react";
import AlbumReview from "../components/detail-album/review/AlbumReview";
import { useLocation, useParams } from "react-router-dom";
import { styled } from "styled-components";

const DetailAlbum = () => {

  const { album_id: albumId } = useParams();
  const location = useLocation()
  console.log("location.state=>",location.state)
  const albumData = location.state.track
  console.log("albumData=>",albumData)

  return (
    <AlbumTag>
      <div className="album-info">
        <img src={albumData.albumUrl} alt="image"/>
        <div>
          <h1>{albumData.title}</h1>
          <p>{albumData.artist}</p>
        </div>
      </div>
      <AlbumReview />
    </AlbumTag>
  );
};

export default DetailAlbum;

const AlbumTag = styled.div`
  margin: 0;
  .album-info{
    display: flex;
    // justify-content: center;
    align-items:center;
    img{
      width: 50%;
    }
  }
`