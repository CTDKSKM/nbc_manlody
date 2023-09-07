import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteComment, getComments, saveComment, updateComment } from '../api/comments';

const useReview = (id?: string) => {
  const queryClient = useQueryClient();
  //useQuery에서 옵션으로 select를 쓰면 모든 것이 들어있는 데이터(---data)를 가공(여기서는 filter)
  const { isLoading, isError, data } = useQuery(['comments'], getComments, {
    select: (data) => data?.filter((comment) => comment.albumId === id).sort((a, b) => b.createdAt - a.createdAt)
  });
  const commentMutation = useMutation(saveComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    }
  });
  const deleteMutation = useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    }
  });
  const updateMutation = useMutation(updateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    }
  });
  return {
    isLoading,
    isError,
    data,
    commentMutation,
    deleteMutation,
    updateMutation
  };
};

export default useReview;
