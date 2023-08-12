import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { addDoc, collection, query, where, deleteDoc, doc, getDocs } from 'firebase/firestore';

import { db } from '../firebase';
import useUser from '../hooks/useUser';
import { useDispatch } from 'react-redux';
import { changePlaylist, addAlbum } from '../redux/modules/playUris';
import { PiPlaylistBold, PiPlayFill } from 'react-icons/pi';
import CarouselFavorite from '../components/FavoriteSlider';

interface Playlist {
  id: string;
  name: string;
  userId: string;
  tracks: {}[];
}

const Modal: React.FC<ModalProps> = ({ onClose, tracks }) => {
  const dispatch = useDispatch();
  const newPlaylistSong = tracks.map((item: any) => ({ name: item.name, artists: item.artists, uri: item.uri }));

  const newPlaylist = () => {
    dispatch(changePlaylist(newPlaylistSong));
  };

  const playTrack = (item: any) => {
    dispatch(changePlaylist([{ name: item.name, artists: item.artists[0].name, uri: item.uri }]));
  };

  const addPlayingNow = (item: any) => {
    dispatch(addAlbum([{ name: item.name, artists: item.artists[0].name, uri: item.uri }]));
  };

  const handleWrapperClick = () => {
    onClose();
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <ModalWrapper onClick={handleWrapperClick}>
      <ModalContent onClick={handleModalContentClick}>
        <div className="button-ctn">
          <button onClick={newPlaylist}>Play to List</button>
          <button onClick={onClose}>❎</button>
        </div>
        {/* {tracks.map((track: any, index) => (
          <p key={track.id}>
            {track.name} - {track.artists[0].name}
          </p>
        ))} */}

        {/* ================================================================ */}
        <div className="track-box">
          {tracks.map((item: any, index: number) => {
            return (
              <BodyGrid key={item.uri}>
                <GridItem>{index + 1}</GridItem>
                <GridItem>
                  <PiPlayFill onClick={() => playTrack(item)}/>
                  <img src={item.albumImg} alt="No Image" />
                  <div>
                    <h1>{item.name}</h1>
                    <p>{item.artists[0].name}</p>
                  </div>
                </GridItem>
                <GridItem>{item.albumName}</GridItem>

                <GridItem>
                  <PiPlaylistBold
                    onClick={() => {
                      addPlayingNow(item);
                      // setModalOpen(true);
                    }}
                  />
                </GridItem>
                {/* <GridItem>{timeData[index]}</GridItem> */}
              </BodyGrid>
            );
          })}
        </div>

        {/* ============================================================== */}
      </ModalContent>
    </ModalWrapper>
  );
};

interface ModalProps {
  onClose: () => void;
  tracks: {}[];
}

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
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 60%;
  max-width: 600px;

  .button-ctn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    > button {
      margin: 0;
    }
  }
`;

// ================================

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 4fr 0.7fr 0.7fr 0.7fr;
  padding: 10px 0px;
  color: #000;
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

// ================================================

const NewPlayList = ({ onAddPlaylist }: { onAddPlaylist: (playlist: Playlist) => void }) => {
  const [playlistName, setPlaylistName] = useState('');
  const { userId } = useUser();

  const submitHandler = async (e: any) => {
    e.preventDefault();

    if (playlistName && userId) {
      try {
        const docRef = await addDoc(collection(db, 'playlists'), {
          name: playlistName,
          userId,
          tracks: []
        });

        onAddPlaylist({ id: docRef.id, name: playlistName, userId, tracks: [] });
        setPlaylistName('');
      } catch (error) {
        console.error('Error adding playlist: ', error);
      }
    }
  };

  const changePlaylistNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistName(e.target.value);
  };

  return (
    <form onSubmit={submitHandler}>
      <label>플레이리스트 이름</label>
      <input type="text" value={playlistName} onChange={changePlaylistNameHandler} />
      <button>생성</button>
    </form>
  );
};

const PlayList = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { userId } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentTracks, setCurrentTracks] = useState<{}[]>([]);

  const handleShowTracks = (tracks: {}[]) => {
    setCurrentTracks(tracks);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTracks([]);
  };

  const handleAddPlaylist = (playlist: Playlist) => {
    setPlaylists((prevPlaylists) => [...prevPlaylists, playlist]);
  };

  const handleDeletePlaylist = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'playlists', id));
      setPlaylists((prevPlaylists) => prevPlaylists.filter((playlist) => playlist.id !== id));
    } catch (error) {
      console.error('Error deleting playlist: ', error);
    }
  };

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

  return (
    <>
      <NewPlayList onAddPlaylist={handleAddPlaylist} />
      <CarouselFavorite playlists={playlists}/>
      {playlists.map((item) => (
        <List key={item.id}>
          <div onClick={() => handleShowTracks(item.tracks)}>{item.name}</div>
          <button onClick={() => handleDeletePlaylist(item.id)}>삭제</button>
        </List>
      ))}
      {isModalOpen && <Modal onClose={handleCloseModal} tracks={currentTracks} />}
    </>
  );
};

export default PlayList;

const List = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  width: 150px;
  height: 100px;
`;
