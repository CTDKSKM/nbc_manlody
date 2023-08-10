import React, { useRef, useState, useEffect } from "react";
import { styled } from "styled-components";
import Carousel from "../components/Slider";
import PauseCarousel from "../components/PuaseSlider";
import { getReturnedParamsFromSpotifyAuth } from "../components/GetAccessToken/GetAccessToken";
const Home = () => {

    const [accessToken, setAccessToken] = useState("");
    useEffect(() => {
      //윈도우 브라우저 현재 주소에 해쉬가 존재하면
      if(window.location.hash) {
        //잘라버리는 작업을 수행합니다.
        const { access_token, token_type, expires_in} = getReturnedParamsFromSpotifyAuth(window.location.hash)
        setAccessToken(access_token)
        sessionStorage.setItem("access_token", access_token);
        const newUrl = window.location.pathname; //현재 페이지의 경로부분을 newUrl에 할당
        // 페이지 url 변경. pushState() 인자로 받는 것은 1. state: null 또는 {}로 지정 2.document.title: 현재 문서의 타이틀 3.url: 변경하고자 하는 경로
        window.history.pushState({}, document.title, newUrl);
        window.location.reload();
      }
    })

    return (
        <HomeWrapper>
            <div className="recommdentaionTag">
                <h2>Today's recommended song</h2>
                <ul>
                    <li>
                        <img src="/img_test.jpg" alt="album" />
                        <div className="album-info">
                            <h4>sing sang sung</h4>
                            <p>
                                Velit exercitation nulla laborum mollit pariatur
                                tempor eiusmod tempor ut ad aliqua esse enim.
                            </p>
                        </div>
                    </li>
                    <li>
                        <img src="/img_test2.jpg" alt="album" />
                        <div className="album-info">
                            <h4>sing sang sung</h4>
                            <p>
                                Velit exercitation nulla laborum mollit pariatur
                                tempor eiusmod tempor ut ad aliqua esse enim.
                            </p>
                        </div>
                    </li>
                    <li>
                        <img src="/img_test.jpg" alt="album" />
                        <div className="album-info">
                            <h4>sing sang sung</h4>
                            <p>
                                Velit exercitation nulla laborum mollit pariatur
                                tempor eiusmod tempor ut ad aliqua esse enim.
                            </p>
                        </div>
                    </li>
                    <li>
                        <img src="/img_test2.jpg" alt="album" />
                        <div className="album-info">
                            <h4>sing sang sung</h4>
                            <p>
                                Velit exercitation nulla laborum mollit pariatur
                                tempor eiusmod tempor ut ad aliqua esse enim.
                            </p>
                        </div>
                    </li>
                    <li>
                        <img src="/img_test.jpg" alt="album" />
                        <div className="album-info">
                            <h4>sing sang sung</h4>
                            <p>
                                Velit exercitation nulla laborum mollit pariatur
                                tempor eiusmod tempor ut ad aliqua esse enim.
                            </p>
                        </div>
                    </li>
                    <li>
                        <img src="/img_test2.jpg" alt="album" />
                        <div className="album-info">
                            <h4>sing sang sung</h4>
                            <p>
                                Velit exercitation nulla laborum mollit pariatur
                                tempor eiusmod tempor ut ad aliqua esse enim.
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
            <div id="hotAlbumTag">
                <h2>Now hot 10 albums</h2>
                <div>
                    <Carousel />
                </div>
            </div>
            <div id="hotAlbumTag">
                <h2>Artists of the month</h2>
                <div>
                    <PauseCarousel />
                </div>
            </div>
        </HomeWrapper>
    );
};

export default Home;

const HomeWrapper = styled.div`
    width: 100%;
    height: 100%;

    border: 1px dotted gray;

    .recommdentaionTag {
        height: 25%;
    }
    h2 {
        margin: 10px 0;
        letter-spacing: -0.5px;
        font-weight: 600;
        color: white;
    }
    ul {
        margin-top: 1.5rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }
    li {
        padding: 6px 10px;
        background-color: rgba(163, 163, 163, 0.836);
        border: 1px solid rgba(236, 236, 236, 0.678);
        border-radius: 8px;
        display: flex;
        align-items: center;
        transition: background-color 0.6s;
        &:hover {
            background-color: rgba(212, 212, 212, 0.863);
        }
    }

    ul > li > img {
        border-radius: 8px;
        width: 60px;
        height: auto;
        object-fit: cover;
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
        margin-top: 2px;
        padding: 4px;
        font-size: 10px;
    }

    #hotAlbumTag {
        margin-top: 20px;
        height: 30%;
    }
`;
