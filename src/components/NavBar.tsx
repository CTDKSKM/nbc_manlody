import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import useUser from '../hooks/useUser';
import NavLiFavoriteSong from './NavLiFavoriteSong';
import { useSelector, useDispatch } from 'react-redux';
import { PiPlaylistBold, PiPlayFill } from 'react-icons/pi';
import { FaRegPlayCircle } from 'react-icons/fa';
import { addAlbum } from '../redux/modules/playUris';

const NavBar = () => {
  const { userId } = useUser();
  const dispatch = useDispatch();
  //@ts-ignore
  const track = useSelector((state) => state.albumTrackSliceReducer);
  const trackData = track.map((item: any) => ({ title: item.name, artist: item.artists[0].name }));

  const playTrack = (item: any) => {
    const playTrack = [item];
    dispatch(addAlbum(playTrack));
  };
  return (
    <Nav>
      <div id="logoBody">
        <Link to="/">
          <img src="/logo_horizontal.png" alt="Logo" />
        </Link>
      </div>
      <ul>{userId && <NavLiFavoriteSong />}</ul>
      <div>
        <Link to="/playlist">🐱‍🏍PLAYLIST🎶</Link>
        <h3>Playing Now</h3>
        <div className="playing-now-ctn">
          {trackData.map((item: any, index: number) => {
            console.log('Navbar name==>', item.title);
            return (
              <ul className="playListCtn">
                <li key={item.uri}>{item.title.length < 10 ? item.title : `${item.title.slice(0, 10)}...`}</li>
                <li key={index}>{item.artist}</li>
                <FaRegPlayCircle className="FaRegPlayCircle"/>
              </ul>
            );
          })}
        </div>
      </div>
    </Nav>
  );
};

export default NavBar;

const Nav = styled.div`
  width: 100%;
  height: 100%;
  /* height: 100vh; */
  // background-color: rgba(75, 75, 75, 0.836);
  border: 1px dotted gray;
  padding: 0 0.5rem 0.5rem;
  position: relative;
  z-index: 9;

  #logoBody {
    position: relative;
    z-index: 9;
    background-color: rgba(163, 163, 163, 0.856);
    border-radius: 8px;
    padding: 0.7rem;
    transition: background-color 0.8s, transform 0.2s;
  }

  #logoBody:hover {
    background-color: rgba(214, 214, 214, 0.656);
    transform: scale(1.017);
  }

  img {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    width: 200px;
    max-width: 80%;
    height: auto;
    cursor: pointer;
    filter: grayscale(1);
    transition: filter 0.8s;
  }
  img:hover {
    filter: none;
  }

  .playing-now-ctn {
    padding: 0.1rem;
    max-height: 65vh;
    overflow-x: hidden;
    overflow-y: scroll;

    /* Webkit 스크롤바 스타일 */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(224, 224, 224, 0.734);
      border-radius: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: 5px;
    }
  }

  .playListCtn {
    display: grid;
    border: 1px solid white;
    color: #fff;
    background: rgb(255, 185, 81, 0.6);
    grid-template-columns: 1.5fr 1fr 0.35fr;
    justify-items: center;
    align-items: center;
    border-radius: 8px;
    padding: 0 0.5rem;
    font-size: 13px;
    font-weight: bold;
    margin: 5px 0;
    &:hover {
      background: rgb(255, 185, 81, 1);
      transition: all 0.3s ease-in-out;

      transform: scale(1.008);
    }
  }
  li {
    margin: 10px 0;
  }
`;
