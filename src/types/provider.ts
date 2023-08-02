import { IErrorType } from './error';

export type IProvider = {
  id: string;
  createdAt: string | Date;
  modifiedAt: string | Date;
  version: number;
  businessId: string;
  name: string;
  engName: string;
  shortName: string;
  address: string;
  email: string;
  website: string;
  phoneNumber: string;
  taxNumber: string;
};

export type IProviderState = {
  providers: IProvider[];
  providerStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
};
