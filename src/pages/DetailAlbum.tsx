import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { styled } from 'styled-components';

import { db } from '../firebase';
import { accessToken } from '../components/Header';
import useUser from '../hooks/useUser';

import AlbumReview from '../components/detail-album/review/AlbumReview';
import ReviewBox from '../components/detail-album/review/ReviewBox';

import { useDispatch } from 'react-redux';
import { addAlbum } from '../redux/modules/playUris';

interface ImageProps {
  url: string;
  height: number;
  width: number;
}

interface Album {
  id: string;
  name: string;
  uri: string;
  artists: {
    name: string;
  }[];
  duration_ms: number;
  liked: boolean;
  images: ImageProps[];
  album_type: string;
  release_date: string;
}

const DetailAlbum = ({ data }: any) => {
  const dispatch = useDispatch();
  const { album_id: albumId } = useParams<string>();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [album, setAlbum] = useState<Album>({
    id: '',
    name: '',
    uri: '',
    artists: [],
    duration_ms: 0,
    liked: false,
    images: [],
    album_type: '',
    release_date: ''
  });
  const [albumTracks, setAlbumTracks] = useState<any>([]);
  const [albumUris, setAlbumUris] = useState<string[]>([]);
  const [openReview, setOpenReview] = useState<boolean>(true);

  const { userId } = useUser();
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };
  const [likedTracks, setLikedTracks] = useState<string[]>([]);
  console.log('album==>', album);
  useEffect(() => {
    try {
      const getAlbum = async () => {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, { headers });
        console.log('response.data=>', response.data);
        console.log('response.data.tracks=>', response.data.tracks);
        setAlbum(response.data);
        setAlbumTracks(response.data.tracks.items);

        const albumUris = response.data.tracks.items.map((item: any) => item.uri);
        setAlbumUris([...albumUris]);
      };

      getAlbum();
    } catch (error) {
      alert('앨범데이터 Get Fail' + error);
      return;
    }
  }, []);

  useEffect(() => {
    if (userId && albumTracks.length > 0) {
      const likesRef = collection(db, 'likes');
      const q = query(
        likesRef,
        where('userId', '==', userId),
        where(
          'trackId',
          'in',
          albumTracks.map((a: any) => a.id)
        )
      );

      getDocs(q)
        .then((snapshot: any) => {
          const likedTrackIds = snapshot.docs.map((doc: any) => doc.data().trackId);
          setLikedTracks(likedTrackIds);
        })
        .catch((error) => {
          console.error('Error fetching liked tracks: ', error);
        });
    }
  }, [userId, albumTracks]);

  const playAlbum = () => {
    dispatch(addAlbum(albumUris));
  };

  const toggleLikeHandler = async (itemId: string) => {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('userId', '==', userId), where('trackId', '==', itemId));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(likesRef, {
        userId: userId,
        trackId: itemId
      });
      setLikedTracks([...likedTracks, itemId]);
    } else {
      for (const docSnapshot of snapshot.docs) {
        const docRef = doc(db, 'likes', docSnapshot.id);
        await deleteDoc(docRef);
      }
      setLikedTracks(likedTracks.filter((id) => id !== itemId));
    }
  };

  const timeData = albumTracks.map((item: any) => {
    const miliseconds = item.duration_ms;
    const seconds = Math.floor(miliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedRemainingSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedRemainingSeconds}`;
  });

  return (
    <AlbumTag>
      <div className="album-info">
        <div className="info-data">
          <img src={album.images[0]?.url} alt="image" />
          <div>
            <h1>{album.name}</h1>
            <div>
              <p>{album.album_type}</p>
              <p>{album.release_date}</p>
            </div>
            <p className="artist-name">{album.artists[0]?.name}</p>
          </div>
        </div>
        <div></div>
        <button onClick={() => setOpenReview(!openReview)}>{openReview ? 'Review' : 'Album Track'} </button>
      </div>
      <div className="add-player">
        <HoverableImage
          src="/addToPlayer_Btn.png"
          style={{ width: '34px' }}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          onClick={playAlbum}
        />
        {tooltipVisible && <span className="tooltip">Add to player</span>}
      </div>
      {openReview ? (
        <div className="result-album">
          <section>
            <p>Track</p>
            <p>Track Infomation</p>
            <p>Album Infomation</p>
            <p>Love it</p>
            <p>Playing Time</p>
          </section>
          <div className="track-box">
            {albumTracks.map((item: any, index: number) => {
              return (
                <BodyGrid key={item.uri}>
                  <GridItem>{index + 1}</GridItem>
                  <GridItem>
                    <img src={album.images[0]?.url} alt="image" />

                    <div>
                      <h1>{item.name}</h1>
                      <p>{item.artists[0].name}</p>
                    </div>
                  </GridItem>
                  <GridItem>{album.name}</GridItem>
                  <GridItem
                    onClick={() => {
                      toggleLikeHandler(item.id);
                    }}
                  >
                    {likedTracks.includes(item.id) ? '❤️' : '🤍'}
                  </GridItem>
                  <GridItem>{timeData[index]}</GridItem>
                </BodyGrid>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <AlbumReview />
          <ReviewBox data={data} />
        </>
      )}
    </AlbumTag>
  );
};

export default DetailAlbum;

const AlbumTag = styled.div`
  width: 100%;

  .album-info {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-bottom: 15px;
    position: relative; /* 이 부분을 추가하세요 */
    img {
      width: 180px;
    }
  }

  .info-data {
    padding-top: 1rem;
    display: flex;
    align-items: end;
    margin-left: 10px;
    margin-bottom: 0;
    bottom: 0;
    img {
      margin-right: 10px;
    }
    h1 {
      font-size: 2rem;
      font-weight: 600;
      height: 32px;
      overflow: hidden; /* 내용이 넘치면 숨기기 */
      text-overflow: ellipsis; /* 텍스트가 넘칠 경우 ...으로 표시 */
      // min-width: 0;
    }
    p {
      font-size: 18px;
      margin-top: 10px;
    }
    .artist-name {
      margin-top: 20px;
    }
  }
  > div > button {
    margin: 0;
    padding: 8px 14px;
    border-radius: 7px;
    display: flex;
    justify-content: right;
    background-color: #eee;
  }

  .add-player {
    position: relative;
  }

  }
  .tooltip {
    position: absolute;
    display: none;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    top: -30px;
    left: 2%;
    transform: translateX(-50%);
  }

  .add-player:hover .tooltip {
    display: block;
  }

  section {
    display: grid;
    // justify-content:space-between;
    // grid-template-columns: 1fr 3fr 2.5fr 1.5fr 2.5fr;
    padding: 10px 0px;
    color: #000;
    gap: 10px;
    overflow-x: auto;
    overflow-y: hidden;
  }
  section :first-child,
  section :last-child,
  section :nth-child(4) {
    text-align: center;
  }
  section > p {
    padding: 0px 10px;
    font-size: 14px;
    white-space: nowrap; /* 텍스트가 넘칠 경우 줄바꿈을 방지합니다 */
    overflow: hidden;
    text-overflow: ellipsis; /* 넘치는 텍스트에 "..."을 추가합니다 */
    height: 20px;
    min-width: 0;

    color: white;
    font-weight: 600;
  }
  .track-box {
    height: 35vh;
    overflow-y: auto;
    overflow-x: hidden;
    transition: transform 0.2s, background-color 0.8s;
    position: relative; /* 필요한 경우 스크롤바 컨테이너에 position:relative; 추가 */
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(224, 224, 224, 0.734);
    border-radius: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 5px;
  }

`;

const HoverableImage = styled.img`
  position: relative;
  width: 34px;
  transition: transform 0.3s, filter 0.3s;

  &:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
  }

  img {
    width: 100%;
  }
`;

const Grid = styled.div`
  display: grid;
  padding: 10px 0px;
  color: #000;
  grid-template-columns: 1fr 3fr 3fr 1.5fr 2.5fr;
  color: #000;
  gap: 10px;
  overflow-x: auto;
`;
const GridItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  font-size: 14px;

  height: 32px;
  white-space: nowrap; /* 텍스트가 넘칠 경우 줄바꿈을 방지합니다 */
  overflow: hidden;
  text-overflow: ellipsis; /* 넘치는 텍스트에 "..."을 추가합니다 */

  &:nth-child(1) {
    text-align: center;
    display: flex;
    justify-content: center;
  }
  &:nth-child(5),
  :nth-child(6) {
    justify-content: center;
  }

  img {
    width: 40px;
    border-radius: 4px;
    margin-right: 10px;
  }
  & > div {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  & > div > h1 {
    font-size: 16px;
    height: 16px;
    overflow: hidden;
    letter-spacing: -0.5px;
  }
  & > div > p {
    font-size: 14px;
    font-size: 16px;
    height: 16px;
    letter-spacing: -0.5px;
    color: #bdbdbd;
    overflow: hidden; /* 내용이 넘치면 숨기기 */
    text-overflow: ellipsis; /* 텍스트가 넘칠 경우 ...으로 표시 */
  }
`;

const BodyGrid = styled(Grid)`
  padding: 10px 0px;
  border-radius: 8px;
  margin: 6px 0px;
  background: rgb(144, 144, 144);
  color: #fff;
  transition: transform 0.2s, background-color 0.8s;
  &:hover {
    background: rgb(175, 175, 175);

    transform: scale(1.008);
  }
  ${GridItem}:nth-child(4) {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0;

    svg {
      width: 24px;
      height: 24px;
      margin-right: 5px;
    }
  }
`;
