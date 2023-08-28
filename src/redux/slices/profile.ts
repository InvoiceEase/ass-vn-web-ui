import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from 'src/utils/axios';
import { IProfileState, IUserAccount } from '../../types/profile';

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
  newProfileData: {
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
  profileFormStep: 0,
  isUpdateSuccess: false,
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
      state.newProfileData = { ...profileData, status: profileData.status.toUpperCase() };
    },

    setNextFormStep(state) {
      state.profileFormStep += 1;
    },

    setPreviousFormStep(state) {
      state.profileFormStep -= 1;
    },

    resetFormStep(state) {
      state.profileFormStep = 0;
    },

    setNewUserData(state, action) {
      state.newProfileData = { ...state.newProfileData, ...action.payload };
    },

    setIsUpdateSuccess(state, action) {
      state.isUpdateSuccess = action.payload;
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

export function setFormStep(isNext: boolean) {
  return (dispatch: Dispatch) => {
    if (isNext) {
      dispatch(slice.actions.setNextFormStep());
    } else {
      dispatch(slice.actions.setPreviousFormStep());
    }
  };
}

export function resetFormStep() {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.resetFormStep());
  };
}

export function updateUserData(updateField: any) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.setNewUserData(updateField));
  };
}

export function updateProfileData(newProfileData: IUserAccount) {
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
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.profile.business}/${businessId}`,
        newProfileData,
        {
          headers: headersList,
        }
      );
      if (response.status === 200) {
        dispatch(slice.actions.getProfileSuccess(response.data));
        dispatch(slice.actions.setIsUpdateSuccess(true));
      } else {
        dispatch(slice.actions.setIsUpdateSuccess(false));
      }
    } catch (error) {
      dispatch(slice.actions.getProfileFailure(error));
    }
  };
}
