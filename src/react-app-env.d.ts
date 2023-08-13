/// <reference types="react-scripts" />

interface ReviewCommentData {
  userId: string;
  userName: string;
  content: string;
  albumId: string;
  createdAt: number;
  isUpdated: boolean;
  docId?: string;
}

interface Track {
  albumUrl?: string;
  artist?: string;
  name?: string;
  title?: string;
  track_uri?: string;
  albumId?: string | number;
  album_type?: string;
  release_date?: string;
  album_uri?: string;
}
