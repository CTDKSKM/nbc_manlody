import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteComment,
  getComments,
  saveComment,
  updateComment,
} from "../api/comments";

const useReview = (id?: string) => {
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery(["comments"], getComments, {
    select: (data) => data?.filter((comment) => comment.albumId === id),
  });
  const commentMutation = useMutation(saveComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
  const deleteMutation = useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
  const updateMutation = useMutation(updateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
  return {
    isLoading,
    isError,
    data,
    commentMutation,
    deleteMutation,
    updateMutation,
  };
};

export default useReview;
