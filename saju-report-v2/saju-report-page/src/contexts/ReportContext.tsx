import { createContext, useContext, ReactNode } from 'react';
import type { ReportData, StaticContent } from '../types';
import { useReportData } from '../hooks/useReportData';
import { staticContent } from '../content/staticContent';

interface ReportContextValue {
  reportData: ReportData | null;
  staticData: StaticContent;
  loading: boolean;
  error: Error | null;
  petName: string;
  ownerName: string;
}

const ReportContext = createContext<ReportContextValue | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
  const { data: reportData, loading, error } = useReportData();

  const petPersona = reportData?.persona?.find((p) => p.type === 'pet');
  const ownerPersona = reportData?.persona?.find((p) => p.type === 'owner');
  const petName = petPersona?.name || '반려동물';
  const ownerName = ownerPersona?.name || '보호자';

  return (
    <ReportContext.Provider
      value={{
        reportData,
        staticData: staticContent,
        loading,
        error,
        petName,
        ownerName,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReportContext() {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReportContext must be used within ReportProvider');
  }
  return context;
}
