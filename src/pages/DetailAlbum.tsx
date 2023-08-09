import React, { useEffect, useState } from "react";
import AlbumReview from "../components/detail-album/review/AlbumReview";
import { useLocation, useParams } from "react-router-dom";
import { styled } from "styled-components";
import axios from "axios";
import { accessToken } from "../components/Header";

const DetailAlbum = () => {
  const { album_id: albumId } = useParams();
  const [album, setAlbum] = useState<any[]>([]);
  const [openReview, setOpenReview] = useState(true);
  const location = useLocation();
  console.log("location.state=>", location.state);
  // console.log("location.state.arr=>",location.state.arr)
  const albumData = location.state.track;
  console.log("albumData=>", albumData);

  const headers = {
    Authorization: `Bearer ${accessToken}`, // accessToken 변수에 실제 access token 값이 들어가야 합니다.
  };

  console.log("album=>", album);
  console.log("album=>", album[0]);

  useEffect(() => {
    const getAlbumId = async () => {
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, { headers });
      console.log("response.data.items++====<>>=>", response.data.items);
      setAlbum([...response.data.items]);
      // return response.data
    };
    getAlbumId();
  }, [albumId]);


  // const optBtnRef = useRef(null);
  // const handleWindowClick = (e: MouseEvent) => {
  //   if (e.target !== optBtnRef.current) setIsOptBoxShow(false);
  // };

  // useEffect(() => {
  //   window.addEventListener("click", handleWindowClick);
  // }, []);

  return (
    <AlbumTag>
      <div className="album-info">
        <img src={albumData.albumUrl} alt="image" />

        <div className="info-data">
          <h1>{albumData.name}</h1>
          <div>
            <p>{albumData.album_type}</p>
            <p>{albumData.release_date}</p>
          </div>
          <p className="artist-name">{albumData.artist}</p>
        </div>
        <button onClick={()=>(setOpenReview(!openReview))}>리뷰남기기</button>
      </div>
      {openReview ? (
        <div className="result-album">
          {album.map((item: any, index) => {
            if (index < 5)
              return (
                <div key={item.uri}>
                  <div>{item.name || "없음"}</div>
                  <div>{item.uri}</div>
                </div>
              );
          })}
        </div>
      ) : (
        <AlbumReview />
      )}
    </AlbumTag>
  );
};

export default DetailAlbum;

const AlbumTag = styled.div`
  margin: 0;
  .album-info {
    display: flex;
    // justify-content: center;
    align-items: end;
    img {
      width: 180px;
    }
  }
  .info-data {
    margin-left: 10px;
    margin-bottom: 0;
    bottom: 0;
    h1 {
      font-size: 3rem;
      font-weight: 600;
    }
    p {
      font-size: 18px;
      margin-top: 10px;
    }
    .artist-name {
      margin-top: 20px;
    }
  }
`;
