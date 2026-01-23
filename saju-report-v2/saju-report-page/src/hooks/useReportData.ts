import { useState, useEffect } from 'react';
import type { ReportData } from '../types';

export function useReportData() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch(`/data.json?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }
        const jsonData: ReportData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error loading report data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { data, loading, error };
}
