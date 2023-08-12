import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteLike, getLikes, toggleLike } from '../api/likes';

const useLikes = () => {
  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery(['likes'], getLikes);

  const toggleMutation = useMutation(toggleLike, {
    onSuccess: () => {
      queryClient.invalidateQueries(['likes']);
    }
  });

  const deleteMutation = useMutation(deleteLike, {
    onSuccess: () => {
      queryClient.invalidateQueries(['likes']);
    }
  });

  return { isLoading, isError, data, toggleMutation, deleteMutation };
};

export default useLikes;
