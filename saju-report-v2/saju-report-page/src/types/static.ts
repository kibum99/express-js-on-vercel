// Static Content Types (from static_data.json)

export interface MainContent {
  title_template: string;
  scroll_hint: string;
}

export interface IntroContent {
  welcome_title: string;
  welcome_msg_template: string;
  pet_saju_title_template: string;
  owner_saju_title_template: string;
  intro_profile: string;
  next_btn: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Chapter {
  id: number;
  title: string;
  icon: string;
  teller_icon: string;
  chapter_overview: string;
  questionTemplate: string;
  desc_queries: Array<{
    query_id: number;
    template: string;
  }>;
  analysis_elements: string[];
  faqs: FAQ[];
}

export interface ChapterDescContent {
  title_template: string;
  keywords_suffix: string;
  analysis_title: string;
  faq_title: string;
  intro_title: string;
  faq_end_btn: string;
  footer_msg: string;
  scroll_hint: string;
}

export interface ChapterContentContent {
  score_label: string;
  score_avg_hint: string;
  detailed_report_title: string;
  lucky_tip_title: string;
  next_chapter_btn: string;
  prev_btn: string;
  last_chapter_btn: string;
  toggle_report_open: string;
  toggle_report_close: string;
}

export interface UILabels {
  prev_btn: string;
  next_btn: string;
}

export interface StaticContent {
  main: MainContent;
  intro: IntroContent;
  chapters: Chapter[];
  chapter_desc: ChapterDescContent;
  chapter_content: ChapterContentContent;
  ui_labels: UILabels;
}
