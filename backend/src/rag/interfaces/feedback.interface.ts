export interface Feedback {
  id: string;
  queryId: string;
  userId: string;
  isHelpful: boolean;
  comment?: string;
  createdAt: Date;
}

export interface QueryRecord {
  id: string;
  query: string;
  response: string;
  context: string[];
  userId: string;
  createdAt: Date;
  feedback?: Feedback;
}
