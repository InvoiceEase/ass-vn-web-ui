import { IErrorType } from 'src/types/error';

export type IBusiness = {
  id: string;
  createdAt: string;
  modifiedAt: string;
  version: null;
  name: string;
  address: string;
  website: null;
  taxNumber: null;
  email: string;
  logo: null;
  invoiceReceivedEmail: string;
  engName: null;
};

export type IBusinessListState = {
  byId: Record<string, IBusiness>;
  allIds: string[];
};

export type IBusinessState = {
  businesses: IBusinessListState;
  selectedBusiness: IBusiness;
  businessesStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
};
