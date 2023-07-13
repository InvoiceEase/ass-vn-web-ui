import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { keyBy } from 'lodash';
import { IBusiness, IBusinessState } from 'src/types/business';
import { API_ENDPOINTS } from 'src/utils/axios';

const initialState: IBusinessState = {
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
};

const slice = createSlice({
  name: 'business',
  initialState,
  reducers: {
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

      state.businesses.byId = keyBy(businesses, 'id');
      state.businesses.allIds = Object.keys(state.businesses.byId);
    },

    setSelectedBusinessSuccess(state, action) {
      const selectedBusiness = action.payload;
      state.selectedBusiness = selectedBusiness;
    },
  },
});

export default slice.reducer;

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
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.business.list}`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getBusinessesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getBusinessesFailure(error));
    }
  };
}

export function setSelectedBusiness(business: IBusiness) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.setSelectedBusinessSuccess(business));
  };
}
