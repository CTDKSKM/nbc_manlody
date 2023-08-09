import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { styled } from "styled-components";

function Pausearousel() {
    const pauseSettings = {
        slide: "div",
        dots: false,
        // arrows: true,
        // autoplay: true,
        // autoplaySpeed: 5000,
        // infinite: true,
        // speed: 500,
        slidesToShow: 4.82,
        slidesToScroll: 1,
        draggable: true,
        cssEase: "linear",
        arrows: false,
        responsive: [
            // 반응형 웹 구현 옵션
            {
                breakpoint: 960, //화면 사이즈 960px일 때
                settings: {
                    //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768, //화면 사이즈 768px일 때
                settings: {
                    //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
                    slidesToShow: 2,
                },
            },
        ],
    };
    return (
        <CarouselWrapper>
            <Slider {...pauseSettings}>
                <div className="box">
                    <img src="/img_test3.jpg" alt="test" />
                    <h5>title</h5>
                    <p>artist</p>
                </div>
                <div className="box">
                    <img src="/img_test4.jpg" alt="test" />
                    <h5>title</h5>
                    <p>artist</p>
                </div>
                <div className="box">
                    <img src="/img_test3.jpg" alt="test" />
                    <h5>title</h5>
                    <p>artist</p>
                </div>
                <div className="box">
                    <img src="/img_test4.jpg" alt="test" />
                    <h5>title</h5>
                    <p>artist</p>
                </div>
                <div className="box">
                    <img src="/img_test3.jpg" alt="test" />
                    <h5>title</h5>
                    <p>artist</p>
                </div>
                <div className="box">
                    <img src="/img_test4.jpg" alt="test" />
                    <h5>title</h5>
                    <p>artist</p>
                </div>
            </Slider>
        </CarouselWrapper>
    );
}

export default Pausearousel;

const CarouselWrapper = styled.section`
    margin-top:1.5rem;
    height:100%;

    .slick-track{
        height: 80%;
    }
    .slick-slider {
        width: 62vw;
        height: 180px;
        margin: 0 auto;
    }
    .slick-slide .box {
        // width: 50%;
        // margin: 0 auto;
        overflow:hidden;
        
    }
    .slick-slide {
        box-sizing: border-box;
        width:50%;
        height: 180px;
        margin: 0 15px;
        background-color: rgba(201, 201, 201, 0.726);
        border-radius: 8px;
        transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
    }
    .slick-slide:hover {
        transform: scale(1.008);
        filter: brightness(1.2);
    }

    .container{
        width:90%;
    }
    img {
        margin: 0 auto;
        margin-top: 20px;
        width: 100px;
        border-radius: 4px;
        object-fit: cover;
        box-sizing: border-box;
        transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
    }
    h5{
        margin-top: 10px;
        font-weight:600;
    }
    h5,p{
        text-align: center;
    }
    p{

    }
    img:hover {
        transform: scale(1.05);
        filter: brightness(1.2);
    }
    .slick-prev,
    .slick-next{
        margin-bottom{
            10px;
        }
    }


`;
