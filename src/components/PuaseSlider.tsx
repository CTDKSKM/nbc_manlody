import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { styled } from 'styled-components';
type Props = {
  homeShowArtists: any;
};
function Pausearousel({ homeShowArtists }: Props) {
  const pauseSettings = {
    slide: 'div',
    dots: false,
    // arrows: true,
    // autoplay: true,
    // autoplaySpeed: 5000,
    // infinite: true,
    // speed: 500,
    slidesToShow: 5.6,
    slidesToScroll: 1,
    draggable: true,
    cssEase: 'linear',
    arrows: false,
    responsive: [
      // 반응형 웹 구현 옵션
      {
        breakpoint: 1600, //화면 사이즈 960px일 때
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          slidesToShow: 4.5
        }
      },
      {
        breakpoint: 1200,
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          slidesToShow: 3.6
        }
      }
    ]
  };
  return (
    <CarouselWrapper>
      <Slider {...pauseSettings}>
        {homeShowArtists.map((item: any, index: number) => {
          return (
            <div className="box" key={index}>
              <img src={item.images[0]?.url} alt="No Image" />
              <h5>{item.name}</h5>
            </div>
          );
        })}
      </Slider>
    </CarouselWrapper>
  );
}

export default Pausearousel;

const CarouselWrapper = styled.section`
  height: 100%;

  .slick-track {
    height: 80%;
  }
  .slick-slider {
    width: 58vw;
    height: 180px;
    margin: 0 auto;
  }
  .slick-slide .box {
    overflow: hidden;
  }
  .slick-slide {
    box-sizing: border-box;
    margin: 0 15px;
    background-color: rgba(201, 201, 201, 0.726);
    border: 1px solid rgba(236, 236, 236, 0.678);
    border-radius: 8px;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
  }
  .slick-slide:hover {
    transform: scale(1.008);
    filter: brightness(1.2);
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out, color 1s ease-in-out;
    h5,
    p {
      color: rgb(109, 109, 109);
    }
  }
  .container {
    width: 90%;
  }
  img {
    margin: 0 auto;
    margin-top: 14px;
    width: 100px;
    height: 100px;
    border-radius: 4px;
    object-fit: contain;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
  }
  img:hover {
    transform: scale(1.025);
    filter: brightness(1.012);
  }
  h5 {
    margin-top: 14px;
    font-size: 14px;
    font-weight: 600;
  }
  h5,
  p {
    text-align: center;
    margin-bottom: 14px;
  }
  p {
  }
  .slick-list {
    margin-top: 18px;
  }
`;
