import { IErrorType } from './error';

export type IAuditor = {
  createdBy: string;
  modifiedBy: string;
  version: string;
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string | Date;
  businessId: string;
  role: string;
  firebaseUserId: string;
  status: string;
  createdAt: string | Date;
  modifiedAt: string | Date;
  password: string;
};

export type IAuditorState = {
  auditors: IAuditor[];
  auditorStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
};
