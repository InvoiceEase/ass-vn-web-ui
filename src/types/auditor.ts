import { IErrorType } from './error';

export type IAuditor = {
  createdBy: string;
  modifiedBy: string;
  version: string;
  id: string;
  userFullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string | Date;
  businessId: string;
  roleName: string;
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
