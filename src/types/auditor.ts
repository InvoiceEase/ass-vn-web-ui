import { IErrorType } from './error';

export type IAuditor = {
  id: string;
  createdAt: string | Date;
  modifiedAt: string | Date;
  version: number;
  name: string;
  firebaseUserId: string;
  role: string;
  organizationId: string;
};

export type IAuditorState = {
  auditors: IAuditor[];
  auditorStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
};
