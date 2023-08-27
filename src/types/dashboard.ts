export type IDashboardState = {
  businessDashboard: IBusinessDashboardState;
  adminDashboard: IAdminDashboardState;
};

export type IBusinessDashboardState = {
  totalInvoices: string;
  totalInvoicesPerMonthDashboardList: number[];
  quarter: string;
  totalTaxAmountNumber: string;
  totalTaxAmountNumberStatus: string;
  months: string[];
  incomeInvoicesTotal: number[];
  outcomeInvoicesTotal: number[];
};

export type ITotalInvoicesPerMonthList = {
  month: string;
  totalInvoices: string;
};

export type IIncomeInvoices = {
  month: string;
  sumTotalPrice: string;
};

export type IOutcomeInvoices = {
  month: string;
  sumTotalPrice: string;
};

export type IAdminDashboardState = {};
