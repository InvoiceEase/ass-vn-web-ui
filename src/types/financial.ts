import { IErrorType } from './error';

type Quarter = '1' | '2' | '3' | '4';

export type IFinancialFolder = {
  year: string;
  quarter: Quarter[];
};

export type IFinancialFile = {
  id: string;
  createdAt: string;
  modifiedAt: string;
  version: number;
  businessId: string;
  year: string;
  quarter: '1' | '2' | '3' | '4';
  cloudFilePath: string;
  reportType: string;
  fileExtension: string;
  fileName: string;
  status: string;
};

export type IFinancialState = {
  folders: IFinancialFolder[];
  foldersStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
  files: IFinancialFile[];
  filesStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
};
