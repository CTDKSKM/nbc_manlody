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
