import { IErrorType } from 'src/types/error';

export type IBusinessAdmin = {
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
  representPersonName: string;
  needAudit: boolean;
  digitalSignatureDueDate: string;
  digitalSignaturePeriod: number;
  digitalSignatureRegisDate: string;
  declarationPeriod: number;
  businessTypeId: number;
  domainBusinessId:number;
  status: string;
};

export type IBusiness= {
  id: string;
  createdAt: string;
  modifiedAt: string;
  version: null;
  name: string;
  address: string;
  website: null;
  taxNumber: string;
  email: string;
  logo: null;
  invoiceReceivedEmail: string;
  engName: null;
}

export type IBusinessListState = {
  byId: Record<string, IBusiness>;
  allIds: string[];
};

export type IBusinessType = {
  id: string;
  createdAt: string;
  modifiedAt: string;
  version: number;
  name: string;
};

export type IBusinessTableFilterValue = string | string[];

export type IBusinessTableFiltersAdmin = {
  name: string;
  email: string;
  representPersonName: string;
  status: string;
};
export type IBusinessTypesState = {
  byId: Record<string, IBusinessType>;
  allIds: string[];
};

export type IBusinessState = {
  businessTypes: IBusinessTypesState;
  businessTypesStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
  businesses: IBusinessListState;
  businessAdmin: IBusinessAdmin[];
  selectedBusiness: IBusiness;
  businessesStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
};
