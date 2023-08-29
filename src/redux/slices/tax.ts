import { Dispatch, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { ITaxFile, ITaxState } from 'src/types/tax';
import { API_ENDPOINTS } from 'src/utils/axios';

const initialState: ITaxState = {
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
  name: 'tax',
  initialState,
  reducers: {
    getTaxFoldersStart(state) {
      state.foldersStatus.loading = true;
      state.foldersStatus.empty = false;
      state.foldersStatus.error = null;
    },
    getTaxFoldersFailure(state, action) {
      state.foldersStatus.loading = false;
      state.foldersStatus.empty = false;
      state.foldersStatus.error = action.payload;
    },
    getTaxFoldersSuccess(state, action) {
      const folders = action.payload;
      state.foldersStatus.empty = !folders.length;
      state.foldersStatus.error = null;
      state.foldersStatus.loading = false;

      state.folders = folders;
    },
    getTaxFilesStart(state) {
      state.filesStatus.loading = true;
      state.filesStatus.empty = false;
      state.filesStatus.error = null;
    },
    getTaxFilesFailure(state, action) {
      state.filesStatus.loading = false;
      state.filesStatus.empty = false;
      state.filesStatus.error = action.payload;
    },
    getTaxFilesSuccess(state, action) {
      const files = action.payload;
      state.filesStatus.empty = !files.length;
      state.filesStatus.error = null;
      state.filesStatus.loading = false;

      state.files = files;
    },
  },
});

export default slice.reducer;

export function getTaxFolders() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getTaxFoldersStart());

    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    const businessId = sessionStorage.getItem('orgId') ?? '0';
    const selectedBusinessId = sessionStorage.getItem('selectedBusinessID') ?? '0';
    const roleCode = sessionStorage.getItem('roleCode') ?? '';

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.financial.folders}`,
        {
          version: 0,
          reportType: 'TAX',
          businessId: roleCode.includes(RoleCodeEnum.Manager) ? businessId : selectedBusinessId,
        },
        {
          headers: headersList,
        }
      );
      if (response.status === 200) {
        dispatch(slice.actions.getTaxFoldersSuccess(response.data.reportStorageFolderMappingList));
      }
    } catch (error) {
      dispatch(slice.actions.getTaxFoldersFailure(error));
    }
  };
}

export function getTaxFiles(year: string | undefined, quarter: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getTaxFilesStart());
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    const businessId = sessionStorage.getItem('orgId') ?? '0';
    const selectedBusinessId = sessionStorage.getItem('selectedBusinessID') ?? '0';
    const roleCode = sessionStorage.getItem('roleCode') ?? '';

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.tax.files}`,
        {
          version: 0,
          businessId: roleCode.includes(RoleCodeEnum.Manager) ? +businessId : +selectedBusinessId,
          year: year ?? '',
        },
        { headers: headersList }
      );
      if (response.status === 200) {
        const quarterFiles = response.data.filter(
          (item: ITaxFile) => item.quarter === quarter.split(' ')[1]
        );
        dispatch(slice.actions.getTaxFilesSuccess(quarterFiles));
      }
    } catch (error) {
      dispatch(slice.actions.getTaxFilesFailure(error));
    }
  };
}
