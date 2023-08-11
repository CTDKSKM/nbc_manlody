import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
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
<<<<<<< HEAD
  const [imgUrl, setImgUrl] = useState<string>('');
=======
>>>>>>> cbd9046a66d25dc66a1d532684680deb42a2a6a7

  const { userId } = useUser();
  const [likedTracks, setLikedTracks] = useState<string[]>([]);

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
    const playTrack = [item]
    dispatch(addAlbum(playTrack));
  };

  const toggleLikeHandler = async (item: any) => {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('userId', '==', userId), where('trackId', '==', item.id));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(likesRef, {
        userId: userId,
        trackId: item.id,
        track: item
      });
      setLikedTracks([...likedTracks, item.id]);
    } else {
      for (const docSnapshot of snapshot.docs) {
        const docRef = doc(db, 'likes', docSnapshot.id);
        await deleteDoc(docRef);
      }
      setLikedTracks(likedTracks.filter((id) => id !== item.id));
    }
  };
  const queryClient = useQueryClient();
  const toggleMutation = useMutation(toggleLikeHandler, {
    onSuccess: () => {
      queryClient.invalidateQueries(['likes']);
    }
  });

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

        console.log('Track added to the playlist');
      } else {
        console.error('Playlist not found');
      }
    } catch (error) {
      console.error('Error adding track to playlist: ', error);
    }
  };
<<<<<<< HEAD
  const [image, setImage] = useState<any>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // useEffect(() => {
  //   if (canvasRef.current instanceof HTMLCanvasElement) {
  //     const canvas = canvasRef.current;
  //     canvas.width = image.width;
  //     canvas.height = image.height;
  //     const ctx = canvas.getContext('2d');
  //     ctx?.drawImage(image, 0, 0);

  //     const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  //     console.log('이미지데이타제발!!=>>', imageData);
  //   }
  // }, []);
=======
>>>>>>> cbd9046a66d25dc66a1d532684680deb42a2a6a7
  return (
    <>
      <AlbumTag>
        <canvas ref={canvasRef}></canvas>
        <button onClick={playAlbum}>앨범플레이</button>
        <div className="album-info">
          <div className="info-data">
            <img
              onLoad={(e) => {
                console.log('e.target==>>', e.target);
                // setImage(e);
              }}
              src={album.images[0]?.url}
              alt="No image"
            />
            <div>
              <h1>{album.name}</h1>
              <div>
                <p>{album.album_type}</p>
                <p>{album.release_date}</p>
              </div>
              <p className="artist-name">{album.artists[0]?.name}</p>
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
              {albumTracks.map((item: any, index: number) => {
                return (
                  <BodyGrid key={item.uri}>
                    <GridItem>{index + 1}</GridItem>
                    <GridItem>
                      <button onClick={() => playTrack(item)}>재생 추가</button>
                      <img src={album.images[0]?.url} alt="image" />

                      <div>
                        <h1>{item.name}</h1>
                        <p>{item.artists[0].name}</p>
                      </div>
                    </GridItem>
                    <GridItem>{album.name}</GridItem>
                    <GridItem
                      onClick={() => {
                        toggleMutation.mutate(item);
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
`;
