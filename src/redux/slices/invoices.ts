import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { IInvoiceState } from 'src/types/invoice';
import { API_ENDPOINTS } from 'src/utils/axios';

const initialState: IInvoiceState = {
  invoices: [],
  invoiceDetails: null,
  pagination: {
    numberOfElements: 0,
    page: 0,
    totalElements: 0,
    totalPages: 0,
  },
  invoicesStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  invoiceDetailsStatus: {
    loading: false,
    empty: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    getInvoicesStart(state) {
      state.invoicesStatus.loading = true;
      state.invoicesStatus.empty = false;
      state.invoicesStatus.error = null;
    },
    getInvoicesFailure(state, action) {
      state.invoicesStatus.loading = false;
      state.invoicesStatus.empty = false;
      state.invoicesStatus.error = action.payload;
    },
    getInvoicesSuccess(state, action) {
      const invoices = action.payload.content;

      state.invoicesStatus.empty = !invoices.length;
      state.invoicesStatus.error = null;
      state.invoicesStatus.loading = false;

      state.invoices = invoices;

      state.pagination = {
        numberOfElements: action.payload.numberOfElements,
        page: action.payload.number,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
      };
    },

    getInvoiceDetailsStart(state) {
      state.invoiceDetailsStatus.loading = true;
      state.invoiceDetailsStatus.empty = false;
      state.invoiceDetailsStatus.error = null;
    },
    getInvoiceDetailsFailure(state, action) {
      state.invoiceDetailsStatus.loading = false;
      state.invoiceDetailsStatus.empty = false;
      state.invoiceDetailsStatus.error = action.payload;
    },
    getInvoiceDetailsSuccess(state, action) {
      const invoiceDetails = action.payload;

      state.invoiceDetailsStatus.empty = !invoiceDetails;
      state.invoiceDetailsStatus.error = null;
      state.invoiceDetailsStatus.loading = false;

      state.invoiceDetails = invoiceDetails;
    },
  },
});

export default slice.reducer;

export function getInvoices(businessId: string, isInputInvoice?: boolean, page?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getInvoicesStart());

    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.invoice.list}`,
        {},
        {
          headers: headersList,
          params: {
            search: '',
            businessId: businessId,
            invoiceCharacters: '',
            invoiceStatus: '',
            incomeInvoice: isInputInvoice ?? true,
            page: page ?? 0,
            size: 10,
            sort: '',
          },
        }
      );
      dispatch(slice.actions.getInvoicesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getInvoicesFailure(error));
    }
  };
}

export function getInvoiceDetails(invoiceId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getInvoiceDetailsStart());
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.invoice.details}${invoiceId}`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getInvoiceDetailsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getInvoiceDetailsFailure(error));
    }
  };
}
