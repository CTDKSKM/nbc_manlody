import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

type Props = {
  homeShowAlbums: any;
};
function Carousel({ homeShowAlbums }: Props) {
  const navigate = useNavigate();
  const settings = {
    slide: 'div',
    dots: false,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    infinite: true,
    speed: 500,
    slidesToShow: 8.6,
    slidesToScroll: 1,
    draggable: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 6
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4.5
        }
      },
      {
        breakpoint: 925,
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          slidesToShow: 3
        }
      }
    ]
  };
  return (
    <CarouselWrapper>
      <Slider {...settings}>
        {homeShowAlbums?.map((item: any, index: number) => {
          return (
            <div className="box" key={index} onClick={() => navigate(`/detail/${item.id}`)}>
              <img src={item.images[0].url} alt="No Image" />
              <h5>{item.name}</h5>
              <p>{item.artists[0].name}</p>
            </div>
          );
        })}
      </Slider>
    </CarouselWrapper>
  );
}

export default Carousel;

const CarouselWrapper = styled.section`
  height: 160px;
  .slick-slide .box {
    margin: 0 auto;
    overflow: hidden;
  }
  .slick-slide {
    box-sizing: border-box;
    margin: 0 30px;
    background: rgba(193, 193, 193, 0.53);
    filter: blur(0.5px);
    backdrop-filter: blur(8px);
    color: #fff;
    transition: transform 0.2s, background-color 0.8s;
    border: 1px solid rgba(236, 236, 236, 0.678);
    border-radius: 8px;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
  }
  .slick-slide:hover {
    transform: scale(1.01);
    filter: brightness(1.08);
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out, color 1s ease-in-out;
    h5,
    p {
      color: rgb(109, 109, 109);
    }
  }
  .container {
    width: 90%;
  }
  h5 {
    font-size: 14px;
    margin-top: 10px;
    padding: 0 4px;
    height: 14px;
    overflow: hidden;
    font-weight: 600;
  }
  h5,
  p {
    text-align: center;
  }
  p {
  }
  img {
    margin: 0 auto;
    margin-top: 18px;
    width: 80px;
    border-radius: 50%;
    object-fit: cover;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
  }
  img:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
  .slick-list {
    margin-top: 18px;
    height: 160px;
  }
  .slick-track {
    height: 100%;
  }
  .slick-slider {
    width: 58vw;
    height: 100%;
    margin: 0 auto;
  }
`;
