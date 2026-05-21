import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useStore from '../store/useStore';

export default function useTimeRange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { timeRange, setTimeRange } = useStore();

  // Sync URL to store on mount
  useEffect(() => {
    const rangeFromUrl = searchParams.get('range');
    const validRanges = ['short_term', 'medium_term', 'long_term'];
    
    if (rangeFromUrl && validRanges.includes(rangeFromUrl) && rangeFromUrl !== timeRange) {
      setTimeRange(rangeFromUrl);
    } else if (!rangeFromUrl) {
      // Sync store to URL if not present
      setSearchParams({ range: timeRange }, { replace: true });
    }
  }, [searchParams, timeRange, setTimeRange, setSearchParams]);

  const handleChange = (newRange) => {
    setTimeRange(newRange);
    setSearchParams({ range: newRange });
  };

  return {
    timeRange,
    setTimeRange: handleChange
  };
}
