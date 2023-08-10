import React, { useEffect } from "react";
import { Track, accessToken } from "../Header";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type TrackSearchProps = {
  track: Track;
  chooseTrack: (track: Track) => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>
};

const TrackSearchResult = ({ track, chooseTrack, setSearch }: TrackSearchProps) => {
  const navigate = useNavigate()

  return (
    <TrackTag>
      <div className="search-list" onClick={() => {
        setSearch("")
        navigate(`detail/${track.albumId}`, { state: {track} })}}>
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
  // margin: 0 auto;
  // margin-right: 0;
  // border: 1px dotted gray;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom:2px;
  padding: 0 1rem;

.search-list {
  background-color: rgba(163, 163, 163, 0.836);
  border-radius: 10px;
  
  width: 100%;
  display: flex;
  /* justify-content: space-between; */
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
  h3{
    text-transform:uppercase;
    font-weight: 600;
    margin: 0 0 6px;
  }
}
`;