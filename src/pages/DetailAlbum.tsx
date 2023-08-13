import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { styled } from 'styled-components';

import { db } from '../firebase';
import { accessToken } from '../components/Header';
import useUser from '../hooks/useUser';

import AlbumReview from '../components/detail-album/review/AlbumReview';
import ReviewBox from '../components/detail-album/review/ReviewBox';

import { useDispatch, useSelector } from 'react-redux';
import { addAlbum } from '../redux/modules/playUris';
import useLikes from '../hooks/useLikes';
import { setRGB } from '../redux/modules/rgb';
import { PiPlaylistBold, PiPlayFill } from 'react-icons/pi';

interface ImageProps {
  url: string;
  height: number;
  width: number;
}

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

interface PlaylistModalProps {
  isOpen: boolean;
  closeModal: () => void;
  playlists: {}[];
  selectedTrack: {} | null;
  addTrackToPlaylist: (id: string) => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, closeModal, playlists, addTrackToPlaylist }) => {
  if (!isOpen) return null;
  return (
    <ModalWrapper>
      <ModalContent>
        <h2>Select a playlist</h2>
        <ul>
          {playlists.map((playlist: any) => (
            <li
              key={playlist.id}
              onClick={() => {
                addTrackToPlaylist(playlist.id);
              }}
            >
              {playlist.name}
            </li>
          ))}
        </ul>
        <button onClick={closeModal}>Close</button>
      </ModalContent>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  z-index: 12;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 12;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
`;

interface Playlist {
  id: string;
  name: string;
  userId: string;
  tracks: string[];
}

const DetailAlbum = ({ data }: any) => {
  //@ts-ignore
  const rgba = useSelector((state) => state.rgbSliceReducer);
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
  const [isModalOpen, setModalOpen] = useState(false);

  const { userId } = useUser();
  const [likedTracks, setLikedTracks] = useState<string[]>([]);
  const { toggleMutation } = useLikes();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<{ id: string } | null>(null);

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  useEffect(() => {
    try {
      const getAlbum = async () => {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, { headers });
        setAlbum(response.data);
        setAlbumTracks(response.data.tracks.items);
        console.log("response==>",response)

        // const albumUris = response.data.tracks.items.map((item: any) => item.uri);
        const albumUris = response.data.tracks.items;
        setAlbumUris([...albumUris]);
      };

      getAlbum();
    } catch (error) {
      alert('앨범데이터 Get Fail' + error);
      return;
    }
  }, [albumId]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (userId) {
        try {
          const q = query(collection(db, 'playlists'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);

          setPlaylists(querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Playlist, 'id'>) })));
        } catch (error) {
          console.error('Error fetching playlists: ', error);
        }
      }
    };
    fetchPlaylists();
  }, [userId]);

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
  const playTrack = (item: any) => {
    const playTrack = [item];
    dispatch(addAlbum(playTrack));
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

  const addTrackToPlaylist = async (playlistId: string) => {
    if (!selectedTrack) {
      console.error('No track selected');
      return;
    }

    try {
      const playlistRef = doc(db, 'playlists', playlistId);
      const playlistSnapshot = await getDoc(playlistRef);

      if (playlistSnapshot.exists()) {
        const playlistData = playlistSnapshot.data() as Playlist;
        if (playlistData.tracks.includes(selectedTrack.id)) {
          console.warn('Track already exists in the playlist');
          return;
        }

        const updatedTracks = [...playlistData.tracks, selectedTrack];
        await updateDoc(playlistRef, {
          tracks: updatedTracks
        });
      } else {
        console.error('Playlist not found');
      }
    } catch (error) {
      console.error('Error adding track to playlist: ', error);
    }
  };

  const imageRef = useRef<HTMLImageElement>(null);
  const extractRGBColors = () => {
    const image = imageRef.current as HTMLImageElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas?.getContext('2d');

    canvas.width = image?.width;
    canvas.height = image?.height;
    ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData?.data as Uint8ClampedArray;

    let redSum = 0;
    let greenSum = 0;
    let blueSum = 0;

    for (let i = 0; i < pixels?.length; i += 4) {
      redSum += pixels[i];
      greenSum += pixels[i + 1];
      blueSum += pixels[i + 2];
    }

    const pixelCount = pixels.length / 4;
    const averageRed = Math.round(redSum / pixelCount);
    const averageGreen = Math.round(greenSum / pixelCount);
    const averageBlue = Math.round(blueSum / pixelCount);

    dispatch(setRGB([averageRed, averageGreen, averageBlue, 1]));
    console.log(`Average RGB: ${averageRed}, ${averageGreen}, ${averageBlue}`);
  };
  const toggleLikeHandler = (item: any) => {
    toggleMutation.mutate({ ...item, trackImg: album.images[0]?.url });
    if (likedTracks.includes(item.id)) {
      setLikedTracks(likedTracks.filter((id) => id !== item.id));
    } else {
      setLikedTracks([...likedTracks, item.id]);
    }
  };
  return (
    <>
      <AlbumTag rgba={rgba}>
        <div className="album-gradient">
          {/* <button onClick={playAlbum}>앨범플레이</button> */}
          <div className="album-info">
            <div className="info-data">
              <img crossOrigin="anonymous" ref={imageRef} onLoad={extractRGBColors} src={album.images[0]?.url} alt="" />
              <div style={{ width: '80%' }}>
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
                <h1>{album.name}</h1>
                <div>
                  <p>{album.album_type}</p>
                  <p>{album.release_date}</p>
                </div>
                <div className="name-toggle-wrapper">
                  <p className="artist-name">{album.artists[0]?.name}</p>
                  <button onClick={() => setOpenReview(!openReview)}>{openReview ? 'Review' : 'Album Track'} </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {openReview ? (
          <div className="result-album">
            <div className="result-wrapper">
              <p>Track</p>
              <p>Track Infomation</p>
              <p>Album Infomation</p>
              <p>Love it</p>
              <p>Playing Time</p>
            </div>
            <div className="track-box">
              {albumTracks.map((item: any, index: number) => {
                const albumTrackWithAlbumData = { ...item, albumImg: album.images[0]?.url, albumName: album.name };
                return (
                  <BodyGrid key={item.uri}>
                    <GridItem onClick={() => playTrack(item)}>
                      <PiPlayFill className="PiPlayFill" />
                    </GridItem>
                    <GridItem>{index + 1}</GridItem>
 
                    <GridItem>
                      <button onClick={() => {
                        setModalOpen(true)
                        setSelectedTrack(albumTrackWithAlbumData)
                      }
                      }
                         >
                        <PiPlaylistBold style={{ fontSize: '20px', marginRight: '10px' }} />
                      </button>
                      <img src={album.images[0]?.url} alt="image" />
                      <div>
                        <h1>{item.name}</h1>
                        <p>{item.artists[0].name}</p>
                      </div>
                    </GridItem>
                    <GridItem>{album.name}</GridItem>
                    <GridItem onClick={() => toggleLikeHandler(item)}>
                      {likedTracks.includes(item.id) ? '❤️' : '🤍'}
                    </GridItem>

                    <GridItem>{timeData[index]}</GridItem>
                  </BodyGrid>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="toggle-wrapper">
            <AlbumReview />
            <ReviewBox data={data} />
          </div>
        )}
      </AlbumTag>
      <PlaylistModal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
        playlists={playlists}
        addTrackToPlaylist={addTrackToPlaylist}
        selectedTrack={selectedTrack}
      />
    </>
  );
};

export default DetailAlbum;

const AlbumTag = styled.div<{ rgba: number[] }>`
  width: 100%;
  height: 80%;
  margin: 1rem 0 0.5rem;
  .album-gradient {
    z-index:7;
    position:relative;
    background: linear-gradient(to bottom, ${({ rgba }) =>
      `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 1)`} 0%, transparent 100%);
      // backdrop-filter: blur(10px);
      // box-shadow: inset  0px 8px 30px rgba(252, 252, 252, 0.422);
      // box-shadow: 0px 8px 20px rgba(252, 252, 252, 0.422);
      filter:brightness(1.2);
      padding-bottom: 0.1px;
      margin-bottom: 10px;
  }
  .album-info {
    margin-bottom: 15px;
    position: relative;
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
    img {
      margin-right: 10px;
    }
    h1 {
      font-size: 2rem;
      font-weight: 600;
      height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
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
    display:flex;
    justify-content: space-between;
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
    z-index: 9;
  }

  .add-player:hover .tooltip {
    display: block;
  }
.result-album{
  position:relative;
  z-index:2;
}
  .result-wrapper {
    width:88%;
    
    margin: 0 auto;
    display: flex;
    justify-content:space-between;
    padding: 10px;
    gap: 10px;
  }
  .result-wrapper :first-child{
    margin-left: -25px;
  }
  .result-wrapper :last-child{
    margin-left: -40px;
  }
  .result-wrapper > p {
    padding: 0px 10px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 20px;
    min-width: 0;

    color: white;
    font-weight: 600;
  }
  .track-box {
    height: 35vh;
    padding:0 12px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: transform 0.2s, background-color 0.8s;
    position: relative;

  }
  .name-toggle-wrapper{
    display: flex;
    justify-content:space-between;
    align-items:center;
    
    button{
      z-index:9;
      background-color: white;
      padding: 8px 12px;
      border-radius: 4px;
      margin-top:20px;
      color:black;
    &:hover{
    color:rgb(64, 64, 64);
    background-color: rgba(218, 218, 218, 0.7);
    }
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
`

const HoverableImage = styled.img`
  position: relative;
  width: 34px;
  margin-bottom: 10px;
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
  grid-template-columns: 0.35fr 0.2fr 2fr 3fr 1.5fr 1fr;
  color: #000;
  gap: 10px;
  overflow-x: auto;
  .result-wrapper {
    width: 92%;

    text-align: left;
    margin-left: -10px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 10px 0px;
    gap: 10px;
  }
  .result-wrapper :first-child {
    margin-left: -20px;
  }
  .result-wrapper > p {
    padding: 0px 10px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 20px;
    min-width: 0;

    color: white;
    font-weight: 600;
  }
`;
const GridItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  font-size: 14px;

  button {
    color: white;
  }
  /* &:nth-child(5),
  :nth-child(6) {
    justify-content: center;
  } */

  // &:last-child {
  //   padding-left: 30px;
  // }

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
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .PiPlayFill {
    scale: 1.3;
    cursor: pointer;
    transition-duration: 0.3s;
    &:hover {
      color: #c30000;
      transition: all 0.3s ease-in-out;
      transform: scale(1.4);
      rotate: 360deg;
    }
  }
`;

const BodyGrid = styled(Grid)`
  padding: 10px 0px;
  border-radius: 8px;
  margin: 6px 0px;
  background: rgba(144, 144, 144, 0.53);

  filter: blur(0.5px);
  backdrop-filter: blur(8px);
  color: #fff;
  transition: transform 0.2s, background-color 0.8s;
  &:hover {
    background: rgba(107, 107, 107, 0.8);
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
  ${GridItem}:nth-child(5) {
    margin-left: 30px;
    cursor: pointer;
    padding: 0;
  }
`;
