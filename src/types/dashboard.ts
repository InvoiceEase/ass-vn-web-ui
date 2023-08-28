export type IDashboardState = {
  businessDashboard: IBusinessDashboardState;
  adminDashboard: IAdminDashboardState;
};

export type IBusinessDashboardState = {
  totalInvoices: string;
  totalInvoicesPerMonthDashboardList: number[];
  totalTaxAmountIncome: ITotalTaxAmountIncome;
  totalTaxAmountOutcome: ITotalTaxAmountOutcome;
  months: string[];
  incomeInvoicesTotal: number[];
  outcomeInvoicesTotal: number[];
};

export type IAdminDashboardState = {
  totalUsers: string;
  totalBusinesses: string;
  totalAuditors: string;
  monthsAdmin: string[];
  totalNumInvoices: number[];
  totalNumMails: number[];
  topBusinesses: ITopBusiness[];
  topAuditors: ITopAuditor[];
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

export type ITotalTaxAmountIncome = {
  quarter: string;
  totalTaxAmountNumber: string;
};

export type ITotalTaxAmountOutcome = {
  quarter: string;
  totalTaxAmountNumber: string;
};

export type INumMails = {
  month: string;
  totalMails: string;
};

export type INumInvoices = {
  month: string;
  totalInvoices: string;
};

export type ITopBusiness = {
  name: string;
  count: number;
};

export type ITopAuditor = {
  name: string;
  count: number;
};
