import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { IProviderState } from 'src/types/provider';
import { API_ENDPOINTS } from 'src/utils/axios';

const initialState: IProviderState = {
  providers: [],
  providerStatus: {
    loading: false,
    empty: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    getProviderStart(state) {
      state.providerStatus.loading = true;
      state.providerStatus.empty = false;
      state.providerStatus.error = null;
    },
    getProviderFailure(state, action) {
      state.providerStatus.loading = false;
      state.providerStatus.empty = true;
      state.providerStatus.error = action.payload;
    },
    getProviderSuccess(state, action) {
      const providers = action.payload;
      state.providerStatus.loading = false;
      state.providerStatus.empty = !providers.length;
      state.providerStatus.error = null;
      state.providers = providers;
    },
  },
});

export default slice.reducer;

export function getProviders() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getProviderStart());
    const token = sessionStorage.getItem('token');

    const businessId = sessionStorage.getItem('orgId');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.provider.list}/${businessId}`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getProviderSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getProviderFailure(error));
    }
  };
}

export function updateProvider(providerId: string, version: number, data: any) {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const businessId = sessionStorage.getItem('orgId');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.provider.update}/${providerId}`,
        {
          version,
          businessId,
          name: data?.name,
          address: data?.address,
          email: data?.email,
          phoneNumber: data?.phoneNumber,
          taxNumber: data?.taxNumber,
        },
        {
          headers: headersList,
        }
      );
    } catch (error) {
      dispatch(slice.actions.getProviderFailure(error));
    }
  };
}

export function addProvider(data: any) {
  return async (dispatch: Dispatch) => {
    const token = sessionStorage.getItem('token');

    const businessId = sessionStorage.getItem('orgId');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.provider.create}`,
        {
          version: 0,
          businessId,
          name: data?.name || '',
          engName: data?.engName || '',
          shortName: data?.shortName || '',
          address: data?.address || '',
          email: data?.email || '',
          website: data?.website || '',
          phoneNumber: data?.phoneNumber || '',
          taxNumber: data?.taxNumber || '',
        },
        {
          headers: headersList,
        }
      );
    } catch (error) {
      dispatch(slice.actions.getProviderFailure(error));
    }
  };
}
