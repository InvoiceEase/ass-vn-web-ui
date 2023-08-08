import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { IAuditorState } from 'src/types/auditor';
import { API_ENDPOINTS } from 'src/utils/axios';

const initialState: IAuditorState = {
  auditors: [],
  auditorStatus: {
    loading: false,
    empty: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'auditor',
  initialState,
  reducers: {
    getAuditorsStart(state) {
      state.auditorStatus.loading = true;
      state.auditorStatus.empty = false;
      state.auditorStatus.error = null;
    },
    getAuditorsFailure(state, action) {
      state.auditorStatus.loading = false;
      state.auditorStatus.empty = true;
      state.auditorStatus.error = action.payload;
    },
    getAuditorsSuccess(state, action) {
      const auditors = action.payload;
      state.auditorStatus.loading = false;
      state.auditorStatus.empty = !auditors.length;
      state.auditorStatus.error = null;
      state.auditors = auditors;
    },
  },
});

export default slice.reducer;

export function getAuditors() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getAuditorsStart());
    const token = sessionStorage.getItem('token');

    const businessId = sessionStorage.getItem('orgId');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.auditor.list}`,
        {
          headers: headersList,
        }
      );
      dispatch(slice.actions.getAuditorsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getAuditorsFailure(error));
    }
  };
}
