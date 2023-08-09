import React, { useRef } from "react";
import { styled } from "styled-components";
import Carousel from "../components/Slider";
import PauseCarousel from "../components/PuaseSlider";

const Home = () => {
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
