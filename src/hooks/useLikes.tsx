import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getLikes } from '../api/likes';

const useLikes = () => {
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery(['likes'], getLikes);

  return { isLoading, isError, data };
};

export default useLikes;
