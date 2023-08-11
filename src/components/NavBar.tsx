import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import useUser from '../hooks/useUser';
import FavoriteSong from './FavoriteSong';

const NavBar = () => {
  const { userId } = useUser();

  return (
    <Nav>
      <div id="logoBody">
        <Link to="/">
          <img src="/logo_horizontal.png" alt="Logo" />
        </Link>
      </div>
      <ul>
        <li>Settings</li>
        {userId && <FavoriteSong />}
      </ul>
      <div>
        <h2>🐱‍🏍PLAYLIST🎶</h2>
        <ul>
          <li>2: title - artist - playBtn</li>
          <li>2: title - artist - playBtn</li>
          <li>2: title - artist - playBtn</li>
          <li>2: title - artist - playBtn</li>
          <li>2: title - artist - playBtn</li>
        </ul>
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

  #logoBody {
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
    max-width: 80%;
    height: auto;
    cursor: pointer;
    filter: grayscale(1);
    transition: filter 0.8s;
  }
  img:hover {
    filter: none;
  }

  li {
    margin: 40px 0;
  }
`;
