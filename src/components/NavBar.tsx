import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import useUser from '../hooks/useUser';
import NavLiFavoriteSong from './NavLiFavoriteSong';
import { useSelector } from 'react-redux';

const NavBar = () => {
  const { userId } = useUser();
  //@ts-ignore
  const track = useSelector((state) => state.albumTrackSliceReducer);
  console.log('NavBarTrack==>', track);
  const trackData = track.map((item: any) => ({ title: item.name, artist: item.artists[0].name }));
  return (
    <Nav>
      <div id="logoBody">
        <Link to="/">
          <img src="/logo_horizontal.png" alt="Logo" />
        </Link>
      </div>
      <ul>
        <li>Settings</li>
        {userId && <NavLiFavoriteSong />}
      </ul>
      <div>
        <Link to="/playlist">🐱‍🏍PLAYLIST🎶</Link>
        {trackData.map((item: any, index: number) => {
          console.log('Navbar name==>', item.title);
          return (
            <ul className="playListCtn">
              <li key={item.uri}>{item.title.length < 10 ? item.title : `${item.title.slice(0, 10)}...`} -</li>
              <li key={index}>{item.artist}</li>
              <button>🤢</button>
            </ul>
          );
        })}
      </div>
    </Nav>
  );
};

export default NavBar;

const Nav = styled.div`
  width: 100%;
  // hight: 100vh;
  // background-color: rgba(75, 75, 75, 0.836);
  border: 1px dotted gray;
  padding: 0 0.5rem 0.5rem;
  position: relative;
  z-index: 9;

  #logoBody {
    position: relative;
    z-index: 9;
    background: rgba(144, 144, 144, 0.53);

    filter: blur(0.5px);
    backdrop-filter: blur(8px);
    color: #fff;
    transition: transform 0.2s, background-color 0.8s;
    border-radius: 8px;
    padding: 0.7rem;
    transition: background-color 0.8s, transform 0.2s;
  }

  #logoBody:hover {
    background-color: rgba(177, 177, 177, 0.556);
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
    filter: grayscale(0.6);
    transition: filter 0.8s;
  }
  img:hover {
    filter: none;
  }
  .playListCtn {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  li {
    margin: 10px 0;
  }
`;
