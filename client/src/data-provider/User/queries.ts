import { useQuery } from '@tanstack/react-query';
import { QueryKeys, dataService } from 'librechat-data-provider';

export const useGetUserSpend = () =>
  useQuery([QueryKeys.userSpend], () => dataService.getUserSpend(), {
    refetchOnWindowFocus: false,
    staleTime: 0,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
  });