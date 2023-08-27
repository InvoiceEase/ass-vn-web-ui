import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  IDashboardState,
  IIncomeInvoices,
  IOutcomeInvoices,
  ITotalInvoicesPerMonthList,
} from 'src/types/dashboard';
import { API_ENDPOINTS } from 'src/utils/axios';

const initialState: IDashboardState = {
  adminDashboard: {},
  businessDashboard: {
    totalInvoices: '0',
    totalInvoicesPerMonthDashboardList: [],
    quarter: '',
    totalTaxAmountNumber: '',
    totalTaxAmountNumberStatus: '',
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
    getSumTaxAmount(state, action) {
      const { quarter, totalTaxAmountNumber } = action.payload;
      //   const totalInvoicesList: number[] = [];
      //   totalInvoicesPerMonthDashboardList.forEach((element: ITotalInvoicesPerMonthList) => {
      //     totalInvoicesList.push(+element.totalInvoices);
      //   });
      state.businessDashboard = {
        ...state.businessDashboard,
        quarter,
        totalTaxAmountNumber,
      };
    },
    getSumTaxAmountStatus(state, action) {
      const { totalTaxAmountNumber } = action.payload;
      state.businessDashboard = {
        ...state.businessDashboard,
        totalTaxAmountNumberStatus: totalTaxAmountNumber,
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

export function getSumTaxAmount(businessId: string | null = '0') {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.businesses}${businessId}/sumTaxAmount`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getSumTaxAmount(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getSumTaxAmountStatus(businessId: string | null = '0') {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.dashboard.businesses}${businessId}/sumTaxAmount/status`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getSumTaxAmountStatus(response.data));
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
