// ----------------------------------------------------------------------

import { IErrorType } from './error';

export type IInvoiceTableFilterValue = string | string[] | Date | null;

export type IInvoiceTableFilters = {
  name: string;
  service: string[];
  attribute: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IInvoiceItem = {
  id: string;
  title: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  description: string;
};

export type IInvoice = {
  id: string;
  createdAt: Date | string;
  modifiedAt: Date | string;
  version: number;
  invoiceSerial: string;
  invoiceNumber: string;
  typeInvoice: number;
  invoiceCharacter: string;
  isInComeInvoice: null;
  invoiceCreatedDate: '2023-07-10T00:00:00';
  currency: 'VND';
  exchangeRate: 1;
  subTotal: number;
  taxAmountTotal: number;
  totalPrice: number;
  status: string;
  isIncludedXml: true;
  senderTaxcode: string;
  receiverTaxCode: string;
  senderAddress: string;
  receiverAddress: string;
  receiverName: string;
  senderName: string;
  senderPhone: string | null;
  taxCodeVerified: string;
  invoiceProviderName: string | null;
  invoiceProviderTaxcode: string;
  mailId: number;
  businessId: number;
  taxDeclarationId: number | null;
  invoiceName: string;
  errorFieldList: string | null;
  pdfFilePath?: string;
};

export type IInvoicePage = {
  numberOfElements: number;
  page: number;
  totalElements: number;
  totalPages: number;
};

export type IInvoiceState = {
  invoices: IInvoice[];
  invoiceDetails: IInvoice | null;
  pagination: IInvoicePage;
  invoicesStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
  invoiceDetailsStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
};
