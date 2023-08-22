import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { keyBy } from 'lodash';
import { IBusiness, IBusinessState } from 'src/types/business';
import { API_ENDPOINTS } from 'src/utils/axios';

const initialState: IBusinessState = {
  businessTypes: {
    byId: {},
    allIds: [],
  },
  businessTypesStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  businesses: {
    byId: {},
    allIds: [],
  },
  selectedBusiness: {
    id: '',
    createdAt: '',
    modifiedAt: '',
    version: null,
    name: '',
    address: '',
    website: null,
    taxNumber: null,
    email: '',
    logo: null,
    invoiceReceivedEmail: '',
    engName: null,
  },
  businessesStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  businessAdmin:[]
};

const slice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    getBusinessTypesStart(state) {
      state.businessTypesStatus.loading = true;
      state.businessTypesStatus.empty = false;
      state.businessTypesStatus.error = null;
    },

    getBusinessTypesFailure(state, action) {
      state.businessTypesStatus.loading = true;
      state.businessTypesStatus.empty = false;
      state.businessTypesStatus.error = action.payload;
    },

    getBusinessTypesSuccess(state, action) {
      const businessTypes = action.payload;
      state.businessTypesStatus.loading = false;
      state.businessTypesStatus.empty = !businessTypes.length;
      state.businessTypesStatus.error = null;

      state.businessTypes.byId = keyBy(businessTypes, 'id');
      state.businessTypes.allIds = Object.keys(state.businessTypes.byId);
    },

    getBusinessesStart(state) {
      state.businessesStatus.loading = true;
      state.businessesStatus.empty = false;
      state.businessesStatus.error = null;
    },

    getBusinessesFailure(state, action) {
      state.businessesStatus.loading = true;
      state.businessesStatus.empty = false;
      state.businessesStatus.error = action.payload;
    },

    getBusinessesSuccess(state, action) {
      const businesses = action.payload;
      state.businessesStatus.loading = false;
      state.businessesStatus.empty = !businesses.length;
      state.businessesStatus.error = null;

      state.businesses.byId = keyBy(businesses.content, 'id');
      state.businesses.allIds = Object.keys(state.businesses.byId);
    },
    getBusinessesAdminSuccess(state, action){
      const businessAdmin = action.payload;
      state.businessAdmin = businessAdmin;
    },
    setSelectedBusinessSuccess(state, action) {
      const selectedBusiness = action.payload;
      state.selectedBusiness = selectedBusiness;
    },
  },
});

export default slice.reducer;

export function getBusinessTypes() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getBusinessTypesStart());
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_BUSINESS_API}${API_ENDPOINTS.business.types}`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getBusinessTypesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getBusinessTypesFailure(error));
    }
  };
}

export function getBusinesses() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getBusinessesStart());
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_BUSINESS_API}${API_ENDPOINTS.business.list}`,
        {
          params: { page: 0, size: 999, sort: '' },
          headers: headersList,
        }
      );
      dispatch(slice.actions.getBusinessesSuccess(response.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.getBusinessesFailure(error));
    }
  };
}

export function getBusinessesAdmin() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getBusinessesStart());
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_BUSINESS_API}${API_ENDPOINTS.business.list}`,
        {
          params: { page: 0, size: 999, sort: '' },
          headers: headersList,
        }
      );
      dispatch(slice.actions.getBusinessesAdminSuccess(response.data.content));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.getBusinessesFailure(error));
    }
  };
}

export function setSelectedBusiness(business: IBusiness) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.setSelectedBusinessSuccess(business));
  };
}
