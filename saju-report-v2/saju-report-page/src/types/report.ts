// Report Data Types (from data.json)

export interface Persona {
  type: 'pet' | 'owner';
  name: string;
  profile_image: string;
  birth: string;
  gender: string;
  solar_lunar: string;
}

export interface Saju {
  type: 'pet' | 'owner';
  천간: string[];
  지지: string[];
  천간십성: string[];
  지지십성: string[];
  '12운성': string[];
  '12신살': string[];
  기타신살: string[];
}

export interface LuckyTip {
  text: string;
  icon: string;
}

export interface ReportContentItem {
  question: string;
  explanation: string;
}

export interface ReportContent {
  lucky_tip: LuckyTip;
  reportContent: ReportContentItem[];
  report: string;
  keywords: string[];
  chapterTitle: string;
  reportOverview: string;
  score: number;
}

export interface ReportData {
  report_contents: ReportContent[];
  persona: Persona[];
  saju: Saju[];
}
