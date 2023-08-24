import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from 'src/utils/axios';
import { IProfileState } from '../../types/profile';

const initialState: IProfileState = {
  profileData: {
    id: '',
    createdAt: '',
    modifiedAt: '',
    version: 1,
    name: '',
    address: '',
    website: null,
    taxNumber: '',
    email: '',
    logo: null,
    invoiceReceivedEmail: '',
    engName: null,
    digitalSignatureDueDate: null,
    digitalSignaturePeriod: null,
    digitalSignatureRegisDate: null,
    representPersonName: null,
    declarationPeriod: '3',
    needAudit: null,
    businessTypeId: null,
    domainBusinessId: null,
  },
  profileStatus: {
    loading: false,
    empty: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getProfileStart(state) {
      state.profileStatus.loading = true;
      state.profileStatus.empty = false;
      state.profileStatus.error = null;
    },

    getProfileFailure(state, action) {
      state.profileStatus.loading = false;
      state.profileStatus.empty = true;
      state.profileStatus.error = action.payload;
    },

    getProfileSuccess(state, action) {
      const profileData = action.payload;
      state.profileStatus.loading = false;
      state.profileStatus.empty = !profileData.length;
      state.profileStatus.error = null;
      state.profileData = profileData;
    },
  },
});

export default slice.reducer;

export function getProfileData() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getProfileStart());
    const token = sessionStorage.getItem('token');

    const businessId = sessionStorage.getItem('orgId');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.profile.business}/${businessId}`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getProfileSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getProfileFailure(error));
    }
  };
}
