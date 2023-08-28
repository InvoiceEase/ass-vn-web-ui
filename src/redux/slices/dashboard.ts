import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  IDashboardState,
  IIncomeInvoices,
  INumInvoices,
  INumMails,
  IOutcomeInvoices,
  ITotalInvoicesPerMonthList,
} from 'src/types/dashboard';
import { API_ENDPOINTS } from 'src/utils/axios';

const initialState: IDashboardState = {
  adminDashboard: {
    totalUsers: '',
    totalBusinesses: '',
    totalAuditors: '',
    monthsAdmin: [],
    totalNumInvoices: [],
    totalNumMails: [],
    topBusinesses: [],
    topAuditors: [],
  },
  businessDashboard: {
    totalInvoices: '0',
    totalInvoicesPerMonthDashboardList: [],
    totalTaxAmountIncome: {
      quarter: '',
      totalTaxAmountNumber: '',
    },
    totalTaxAmountOutcome: {
      quarter: '',
      totalTaxAmountNumber: '',
    },
    months: [],
    incomeInvoicesTotal: [],
    outcomeInvoicesTotal: [],
  },
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    getTotalInvoices(state, action) {
      const { totalInvoices, totalInvoicesPerMonthDashboardList } = action.payload;
      const totalInvoicesList: number[] = [];
      totalInvoicesPerMonthDashboardList.forEach((element: ITotalInvoicesPerMonthList) => {
        totalInvoicesList.push(+element.totalInvoices);
      });
      state.businessDashboard = {
        ...state.businessDashboard,
        totalInvoices,
        totalInvoicesPerMonthDashboardList: totalInvoicesList,
      };
    },
    getSumTaxAmountIncome(state, action) {
      const { quarter, totalTaxAmountNumber } = action.payload;
      //   const totalInvoicesList: number[] = [];
      //   totalInvoicesPerMonthDashboardList.forEach((element: ITotalInvoicesPerMonthList) => {
      //     totalInvoicesList.push(+element.totalInvoices);
      //   });
      state.businessDashboard = {
        ...state.businessDashboard,
        totalTaxAmountIncome: {
          quarter,
          totalTaxAmountNumber,
        },
      };
    },
    getSumTaxAmountOutcome(state, action) {
      const { quarter, totalTaxAmountNumber } = action.payload;
      state.businessDashboard = {
        ...state.businessDashboard,
        totalTaxAmountOutcome: { quarter, totalTaxAmountNumber },
      };
    },
    getTotalPrice(state, action) {
      const { incomeInvoices, outcomeInvoices } = action.payload;
      const months: string[] = [];
      const incomeInvoicesTotal: number[] = [];
      const outcomeInvoicesTotal: number[] = [];
      incomeInvoices.forEach((element: IIncomeInvoices) => {
        months.push(element.month);
        incomeInvoicesTotal.push(+element.sumTotalPrice);
      });
      outcomeInvoices.forEach((element: IOutcomeInvoices) => {
        outcomeInvoicesTotal.push(+element.sumTotalPrice);
      });
      state.businessDashboard = {
        ...state.businessDashboard,
        months,
        incomeInvoicesTotal,
        outcomeInvoicesTotal,
      };
    },
    getTotalStat(state, action) {
      const { totalUsers, totalBusinesses, totalAuditors } = action.payload;
      state.adminDashboard = {
        ...state.adminDashboard,
        totalUsers,
        totalBusinesses,
        totalAuditors,
      };
    },
    getNumMails(state, action) {
      const { totalMailsPerMonth } = action.payload;
      const months: string[] = [];
      const totalNumMails: number[] = [];
      totalMailsPerMonth.forEach((element: INumMails) => {
        months.push(element.month);
        totalNumMails.push(+element.totalMails);
      });
      state.adminDashboard = {
        ...state.adminDashboard,
        monthsAdmin: months,
        totalNumMails,
      };
    },
    getNumInvoices(state, action) {
      const { totalInvoicesPerMonthDashboardList } = action.payload;
      const totalNumInvoices: number[] = [];
      totalInvoicesPerMonthDashboardList.forEach((element: INumInvoices) => {
        totalNumInvoices.push(+element.totalInvoices);
      });
      state.adminDashboard = {
        ...state.adminDashboard,
        totalNumInvoices,
      };
    },
    getTopAuditors(state, action) {
      state.adminDashboard = {
        ...state.adminDashboard,
        topAuditors: action.payload,
      };
    },
    getTopBusinesses(state, action) {
      state.adminDashboard = {
        ...state.adminDashboard,
        topBusinesses: action.payload,
      };
    },
  },
});

export default slice.reducer;

export function getTotalInvoices(businessId: string | null = '0') {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.businesses}${businessId}/totalInvoices`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getTotalInvoices(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getSumTaxAmountIncome(businessId: string | null = '0') {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.businesses}${businessId}/sumTaxAmount/income`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getSumTaxAmountIncome(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getSumTaxAmountOutcome(businessId: string | null = '0') {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.businesses}${businessId}/sumTaxAmount/outcome`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getSumTaxAmountOutcome(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getTotalPrice(businessId: string | null = '0') {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.businesses}${businessId}/totalPrice`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getTotalPrice(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getTotalStat() {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.admin}totalStat`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getTotalStat(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getNumInvoices() {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.admin}eInvoices`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getNumInvoices(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getNumMails() {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.admin}mails`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getNumMails(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getTopAuditors() {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.admin}topThreeAudits`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getTopAuditors(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getTopBusinesses() {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.admin}topThreeInvoices`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getTopBusinesses(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}
