import React, { useEffect, useState } from 'react';
import AlbumReview from '../components/detail-album/review/AlbumReview';
import { useLocation, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import axios from 'axios';
import { accessToken } from '../components/Header';

interface Album {
  id?: string;
  name?: string;
  uri?: string;
  artists?: {
    name?: string;
  }[];
}

const DetailAlbum = () => {
  const { album_id: albumId } = useParams<string>();
  const [album, setAlbum] = useState<Album[]>([]);
  const [openReview, setOpenReview] = useState<boolean>(true);
  const location = useLocation();
  const albumData = location.state.track;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };
  console.log('album=>', album);
  useEffect(() => {
    try {
      const getAlbumId = async () => {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, { headers });
        setAlbum([...response.data.items]);
      };
      getAlbumId();
    } catch (error) {
      alert('앨범데이터 Get Fail' + error);
      return;
    }
  }, [albumId]);

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
        <button onClick={() => setOpenReview(!openReview)}>리뷰남기기</button>
      </div>
      {openReview ? (
        <div className="result-album">
          {album.map((item) => {
            return (
              <div key={item.uri}>
                <div>{item.name || '없음'}</div>
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
