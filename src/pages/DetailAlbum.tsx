import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { styled } from 'styled-components';

import { db } from '../firebase';
import { accessToken } from '../components/Header';
import useUser from '../hooks/useUser';

import AlbumReview from '../components/detail-album/review/AlbumReview';
import ReviewBox from '../components/detail-album/review/ReviewBox';

import { useDispatch } from 'react-redux';
import { addAlbum } from '../redux/modules/playUris';

interface Album {
  id?: string;
  name?: string;
  uri?: string;
  artists?: {
    name?: string;
  }[];
  duration_ms?: number;
  liked?: boolean;
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
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
  const dispatch = useDispatch();
  const { album_id: albumId } = useParams<string>();
  const [album, setAlbum] = useState<Album[]>([]);
  const [albumUris, setAlbumUris] = useState<string[]>([]);
  const [openReview, setOpenReview] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  const { userId } = useUser();
  const [likedTracks, setLikedTracks] = useState<string[]>([]);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<{ id: string } | null>(null);

  const albumData = location.state.track;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  useEffect(() => {
    try {
      const getAlbum = async () => {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, { headers });
        setAlbum([...response.data.tracks.items]);
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
    if (userId && album.length > 0) {
      const likesRef = collection(db, 'likes');
      const q = query(
        likesRef,
        where('userId', '==', userId),
        where(
          'trackId',
          'in',
          album.map((a) => a.id)
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
  }, [userId, album]);

  const playAlbum = () => {
    dispatch(addAlbum(albumUris));
  };
  console.log('album==>', album);
  console.log('albumuri==>', albumUris);

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

  const timeData = album.map((item: any) => {
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

        console.log('Track added to the playlist');
      } else {
        console.error('Playlist not found');
      }
    } catch (error) {
      console.error('Error adding track to playlist: ', error);
    }
  };

  return (
    <>
      <AlbumTag>
        <button onClick={playAlbum}>앨범플레이</button>
        <div className="album-info">
          <div className="info-data">
            <img src={albumData.albumUrl} alt="image" />
            <div>
              <h1>{albumData.name}</h1>
              <div>
                <p>{albumData.album_type}</p>
                <p>{albumData.release_date}</p>
              </div>
              <p className="artist-name">{albumData.artist}</p>
            </div>
          </div>
          <button onClick={() => setOpenReview(!openReview)}>{openReview ? 'Review' : 'Album Track'} </button>
        </div>
        {openReview ? (
          <div className="result-album">
            <Grid>
              <GridItem>#</GridItem>
              <GridItem>곡 정보</GridItem>
              <GridItem>앨범 정보</GridItem>
              <GridItem>좋아요</GridItem>
              <GridItem>재생 시간</GridItem>
            </Grid>
            <div className="track-box">
              {album.map((item: any, index) => {
                return (
                  <BodyGrid key={item.uri}>
                    <GridItem>{index + 1}</GridItem>
                    <GridItem>
                      <img src={albumData.albumUrl} alt="image" />

                      <div>
                        <h1>{item.name}</h1>
                        <p>{item.artists[0].name}</p>
                      </div>
                    </GridItem>
                    <GridItem>{albumData.name}</GridItem>
                    <GridItem
                      onClick={() => {
                        toggleLikeHandler(item.id);
                      }}
                    >
                      {likedTracks.includes(item.id) ? '❤️' : '🤍'}
                    </GridItem>
                    <GridItem
                      onClick={() => {
                        setSelectedTrack(item);
                        setModalOpen(true);
                      }}
                    >
                      Add playlist
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

const AlbumTag = styled.div`
  width: 100%;
  .album-info {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-bottom: 15px;
    img {
      width: 180px;
    }
  }
  .info-data {
    display: flex;
    align-items: end;
    margin-left: 10px;
    margin-bottom: 0;
    bottom: 0;
    img {
      margin-right: 10px;
    }
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
  > div > button {
    margin: 0;
    padding: 8px 14px;
    border-radius: 7px;
    display: flex;
    justify-content: right;
    background-color: #eee;
  }
  .track-box {
    height: 35vh;
    overflow-y: scroll;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 4fr 0.7fr 0.7fr 0.7fr;
  padding: 10px 0px;
  color: #000;
`;
const GridItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  font-size: 14px;
  &:nth-child(5),
  :nth-child(6) {
    justify-content: center;
  }

  img {
    width: 40px;
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
    letter-spacing: -0.5px;
  }
  & > div > p {
    font-size: 14px;
    letter-spacing: -0.5px;
    color: #bdbdbd;
  }
`;

const BodyGrid = styled(Grid)`
  padding: 10px 0px;
  /* border-radius: 10px; */
  margin: 6px 0px;
  background: #353535;
  color: #fff;
  &:hover {
    background: #3f3f3f;
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
  // 4th-child{
  //   loloClose: 20px;
  // }
`;

const CommentWrap = styled.div`
  padding: 20px 0px;
`;
const CommentWiteForm = styled.form`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  > input {
    width: 100%;
    padding: 10px 0px;
    outline: none;
    border-radius: 7px;
    background: #999;
    border: none;
  }
  > button {
    background: #999;
    border: none;
    border-radius: 7px;
    color: #fff;
  }
`;
const Comment = styled.div`
  display: flex;
  justify-content: space-between;
  color: #fff;
  padding: 16px 10px;
  border-bottom: solid 1px #adadad;
`;

const ToggleButton = styled.p`
  position: relative;
  left: 0px;
  top: 0px;
`;
const ToggleBoxWrap = styled.div`
  position: absolute;
  right: 0px;
  bottom: 30px;
  width: 100px;
  background: #eee;
  border-radius: 7px;
  text-align: center;
`;
