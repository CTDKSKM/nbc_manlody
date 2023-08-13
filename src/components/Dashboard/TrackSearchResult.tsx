import React, { useEffect, useState } from 'react';
import { Track, accessToken } from '../Header';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type TrackSearchProps = {
  track: Track;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

const TrackSearchResult = ({ track }: TrackSearchProps) => {
  const navigate = useNavigate();
  return (
    <TrackTag>
      <div
        className="search-list"
        onClick={() => {
          navigate(`detail/${track.albumId}`);
        }}
      >
        <img src={track.albumUrl} alt="img" />
        <div className="search-info">
          <h3>{track.title?.slice(0, 30)}</h3>
          <p>{track.artist}</p>
        </div>
      </div>
    </TrackTag>
  );
};

export default TrackSearchResult;

const TrackTag = styled.header`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  padding: 0 1rem 0.3rem;

  .search-list {
    background: rgba(193, 193, 193, 0.43);
    filter: blur(0.5px);
    backdrop-filter: blur(8px);
    box-shadow: 5px 2px 10px rgba(128, 128, 128, 0.659);
    border-radius: 10px;

    width: 100%;
    display: flex;
    align-items: center;
    padding: 0.5rem 0.7rem;
    cursor: pointer;

    transition: background-color 0.6s;
    &:hover {
      background-color: rgba(212, 212, 212, 0.863);
    }
    img {
      border-radius: 4px;
      height: 50px;
      width: 50px;
    }
  }

  .search-info {
    margin-left: 8px;
    font-size: 12px;
    img {
      height: 64px;
      width: 64px;
    }
    h3 {
      text-transform: uppercase;
      font-weight: 600;
      margin: 0 0 6px;
    }
  }
`;
