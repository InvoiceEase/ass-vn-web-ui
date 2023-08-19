import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { IFinancialFile, IFinancialState } from 'src/types/financial';
import { API_ENDPOINTS } from 'src/utils/axios';

const initialState: IFinancialState = {
  folders: [],
  foldersStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  files: [],
  filesStatus: {
    loading: false,
    empty: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    getFinancialFoldersStart(state) {
      state.foldersStatus.loading = true;
      state.foldersStatus.empty = false;
      state.foldersStatus.error = null;
    },
    getFinancialFoldersFailure(state, action) {
      state.foldersStatus.loading = false;
      state.foldersStatus.empty = false;
      state.foldersStatus.error = action.payload;
    },
    getFinancialFoldersSuccess(state, action) {
      const folders = action.payload;
      state.foldersStatus.empty = !folders.length;
      state.foldersStatus.error = null;
      state.foldersStatus.loading = false;

      state.folders = folders;
    },
    getFinancialFilesStart(state) {
      state.filesStatus.loading = true;
      state.filesStatus.empty = false;
      state.filesStatus.error = null;
    },
    getFinancialFilesFailure(state, action) {
      state.filesStatus.loading = false;
      state.filesStatus.empty = false;
      state.filesStatus.error = action.payload;
    },
    getFinancialFilesSuccess(state, action) {
      const files = action.payload;
      state.filesStatus.empty = !files.length;
      state.filesStatus.error = null;
      state.filesStatus.loading = false;

      state.files = files;
    },
  },
});

export default slice.reducer;

export function getFinancialFolders() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getFinancialFoldersStart());

    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.financial.folders}`,
        {
          version: 0,
          reportType: 'FINANCIAL',
        },
        {
          headers: headersList,
        }
      );
      if (response.status === 200) {
        dispatch(
          slice.actions.getFinancialFoldersSuccess(response.data.reportStorageFolderMappingList)
        );
      }
    } catch (error) {
      dispatch(slice.actions.getFinancialFoldersFailure(error));
    }
  };
}

export function getFinancialFiles(year: string | undefined) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getFinancialFilesStart());
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    const businessId = sessionStorage.getItem('orgId');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.financial.files}`,
        {
          version: 0,
          businessId: businessId ?? '',
          year: year ?? '',
        },
        { headers: headersList }
      );
      if (response.status === 200) {
        const quarterFiles = response.data.filter((item: IFinancialFile) => item.year === year);
        dispatch(slice.actions.getFinancialFilesSuccess(quarterFiles));
      }
    } catch (error) {
      dispatch(slice.actions.getFinancialFilesFailure(error));
    }
  };
}
