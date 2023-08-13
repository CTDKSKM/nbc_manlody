import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import Carousel from '../components/Slider';
import PauseCarousel from '../components/PuaseSlider';
import { spotifyApi } from '../components/Header';
import { useNavigate } from 'react-router';
import { getReturnedParamsFromSpotifyAuth } from '../api/accesstoken';

const Home = () => {
  const navigate = useNavigate();
  const [homeShowTracks, setHomeShowTracks] = useState<any>([]);
  const [homeShowArtists, setHomeShowArtists] = useState<any>([]);
  const [homeShowAlbums, setHomeShowAlbums] = useState<any>([]);

  useEffect(() => {
    //윈도우 브라우저 현재 주소에 해쉬가 존재하면
    if (window.location.hash) {
      //잘라버리는 작업을 수행합니다.
      const { access_token } = getReturnedParamsFromSpotifyAuth(window.location.hash);
      sessionStorage.setItem('access_token', access_token);
      const newUrl = window.location.pathname; //현재 페이지의 경로부분을 newUrl에 할당
      // 페이지 url 변경. pushState() 인자로 받는 것은 1. state: null 또는 {}로 지정 2.document.title: 현재 문서의 타이틀 3.url: 변경하고자 하는 경로
      window.history.pushState({}, document.title, newUrl);
      window.location.reload();
    }
    // const sessionToken = sessionStorage.getItem('access_token');
    // setAccessToken(sessionToken);

    const generateRandomString = (length: number): string => {
      const characters = 'abcdefghijklmnopqrstuvwxyz';
      let result = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      return result;
    };

    const randomString1 = generateRandomString(3);
    const randomString2 = generateRandomString(3);
    const randomString3 = generateRandomString(3);

    spotifyApi.searchTracks(randomString1, { limit: 6 }).then((res) => {
      const homeShowTracks = res.body.tracks?.items;
      setHomeShowTracks(homeShowTracks);
    });
    spotifyApi.searchArtists(randomString2, { limit: 6 }).then((res) => {
      const homeShowArtists = res.body.artists?.items;
      setHomeShowArtists(homeShowArtists);
    });
    spotifyApi.searchAlbums(randomString3, { limit: 10 }).then((res) => {
      const homeShowAlbums = res.body.albums?.items;
      setHomeShowAlbums(homeShowAlbums);
    });
  }, []);
  return (
    <HomeWrapper>
      <div className="recommdentaionTag">
        <h2>Today's Song</h2>
        <ul>
          {homeShowTracks?.map((item: any, index: number) => {
            return (
              <li key={index} onClick={() => navigate(`/detail/${item.album.id}`)}>
                <img src={item.album.images[1].url} alt="no Album cover" />
                <div className="info-wrapper">
                  <h3>{item.name}</h3>
                  <p>{item.artists[0].name}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div id="hotAlbumTag">
        <h2>Now hot 10 albums</h2>
        <div>
          <Carousel homeShowAlbums={homeShowAlbums} />
        </div>
      </div>
      <div id="hotAlbumTag">
        <h2>Artists of the month</h2>
        <div>
          <PauseCarousel homeShowArtists={homeShowArtists} />
        </div>
      </div>
    </HomeWrapper>
  );
};
export default Home;

const HomeWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 0.5rem;
  z-index: 7;
  .recommdentaionTag {
    margin: 1rem 0;
    height: 30%;
  }
  h2 {
    margin: 0.8rem 0 1.5rem;
    color: white;
    font-weight: bold;
  }
  ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  li {
    padding: 6px 10px;
    background: rgba(144, 144, 144, 0.53);
    filter: blur(0.5px);
    backdrop-filter: blur(8px);
    color: #fff;
    transition: transform 0.2s, background-color 0.8s;
    border: 1px solid rgba(236, 236, 236, 0.678);
    border-radius: 8px;
    display: flex;
    align-items: center;
    transition: background-color 0.6s;
    &:hover {
      background-color: rgba(212, 212, 212, 0.863);
    }
  }
  ul > li:nth-child(6) {
    justify-content: flex-start;
  }
  ul > li > img {
    border-radius: 8px;
    width: 60px;
    height: auto;
    object-fit: cover;
  }
  li > .info-wrapper {
    margin-left: 8px;
  }
  .info-wrapper > h3 {
    font-size: 15px;
    height: 16px;
    overflow: hidden;
  }
  .album-info {
    height: 45px;
    flex-grow: 1;
    padding: 4px 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: wrap;
  }
  h4 {
    font-size: 12px;
    font-weight: 600;
  }
  p {
    margin: 4px 0;
    font-size: 10px;
  }

  #hotAlbumTag {
    margin-top: 1.5rem;
  }
`;
