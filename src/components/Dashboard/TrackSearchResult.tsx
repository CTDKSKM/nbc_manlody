import React from "react";
import { Track } from "./Dashboard";

type TrackSearchProps = {
  track: Track
  chooseTrack: (track: Track) => void;
};

const TrackSearchResult = ({ track, chooseTrack }: TrackSearchProps) => {
  const handlePlay = () => {
    console.log("track=>>>>", track);
    chooseTrack(track);
  };
  return (
    <div className="d-flex m-2 align-items-center" onClick={handlePlay}>
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
        <div>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>
    </div>
  );
};

export default TrackSearchResult;


