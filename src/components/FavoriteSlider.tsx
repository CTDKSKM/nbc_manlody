import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

type Props = {
  playlists: any;
};

function CarouselFavorite({ playlists }: Props) {
  const navigate = useNavigate();

  const settings = {
    slide: 'div',
    dots: false,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5.9,
    slidesToScroll: 1,
    draggable: true,
    cssEase: 'linear',
    gap: 10,
    responsive: [
      // 반응형 웹 구현 옵션
      {
        breakpoint: 960, //화면 사이즈 960px일 때
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768, //화면 사이즈 768px일 때
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          slidesToShow: 2
        }
      }
    ]
  };
  return (
    <CarouselWrapper>
      <Slider {...settings}>
        {playlists?.map((item: any, index: number) => {
          return (
            <div className="box" key={index} onClick={() => navigate(`/detail/${item.id}`)}>
              {/* <img src={item.images[0].url} alt="No Image" /> */}
              <h5>{item.name}</h5>
              {/* <p>{item.artists[0].name}</p> */}
            </div>
          );
        })}
      </Slider>
    </CarouselWrapper>
  );
}

export default CarouselFavorite;

const CarouselWrapper = styled.section`
  margin-top: 1.5rem;
  height: 160px;
  .slick-slide .box {
    width: 50%;
    margin: 0 auto;
    overflow: hidden;
  }
  .slick-slide {
    box-sizing: border-box;
    width: 50%;
    margin: 0 15px;
    background-color: rgba(236, 236, 236, 0.61);
    border-radius: 8px;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
  }
  .slick-slide:hover {
    transform: scale(1.008);
    filter: brightness(1.2);
  }

  .container {
    width: 90%;
  }
  h5 {
    margin-top: 10px;
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
    height: 160px;
  }
  .slick-track {
    height: 100%;
  }
  .slick-slider {
    width: 60vw;
    height: 100%;
    margin: 0 auto;
  }
`;
