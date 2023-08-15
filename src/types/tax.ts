import { IErrorType } from './error';

type Quarter = '1' | '2' | '3' | '4';

export type ITaxFolder = {
  year: string;
  quarter: Quarter[];
};

export type ITaxFile = {
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

export type ITaxState = {
  folders: ITaxFolder[];
  foldersStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
  files: ITaxFile[];
  filesStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
};
