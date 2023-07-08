import keyBy from 'lodash/keyBy';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios, { API_ENDPOINTS } from 'src/utils/axios';
// types
import { IMailState } from 'src/types/mail';

// ----------------------------------------------------------------------

const initialState: IMailState = {
  labels: [],
  mails: {
    byId: {},
    allIds: [],
  },
  labelsStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  mailsStatus: {
    loading: false,
    empty: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    // GET LABELS
    // getLabelsStart(state) {
    //   state.labelsStatus.loading = true;
    //   state.labelsStatus.empty = false;
    //   state.labelsStatus.error = null;
    // },
    // getLabelsFailure(state, action) {
    //   state.labelsStatus.loading = false;
    //   state.labelsStatus.empty = false;
    //   state.labelsStatus.error = action.payload;
    // },
    // getLabelsSuccess(state, action) {
    //   const labels = action.payload;

    //   state.labels = labels;

    //   state.labelsStatus.loading = false;
    //   state.labelsStatus.empty = !labels.length;
    //   state.labelsStatus.error = null;
    // },

    // GET MAILS
    getMailsStart(state) {
      state.mailsStatus.loading = true;
      state.mailsStatus.empty = false;
      state.mailsStatus.error = null;
    },
    getMailsFailure(state, action) {
      state.mailsStatus.loading = false;
      state.mailsStatus.empty = false;
      state.mailsStatus.error = action.payload;
    },
    getMailsSuccess(state, action) {
      const mails = action.payload;

      state.mailsStatus.loading = false;
      state.mailsStatus.empty = !mails.length;
      state.mailsStatus.error = null;

      state.mails.byId = keyBy(mails, 'id');
      state.mails.allIds = Object.keys(state.mails.byId);
    },

    // GET MAIL
    getMailSuccess(state, action) {
      const mail = action.payload;

      state.mails.byId[mail.id] = mail;
      if (!state.mails.allIds.includes(mail.id)) {
        state.mails.allIds.push(mail.id);
      }
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

// export function getLabels() {
//   return async (dispatch: Dispatch) => {
//     dispatch(slice.actions.getLabelsStart());

//     try {
//       const response = await axios.get(API_ENDPOINTS.mail.labels);
//       dispatch(slice.actions.getLabelsSuccess(response.data.labels));
//     } catch (error) {y
//       dispatch(slice.actions.getLabelsFailure(error));
//     }
//   };
// }

// ----------------------------------------------------------------------

export function getMails(businessId: string | null, searchQuery?: string, page?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getMailsStart());

    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.mail.list}`,
        {
          headers: headersList,
          params: {
            businessId,
            search: searchQuery ?? '',
            page: page ?? 0,
            size: 10,
            sort: [],
          },
        }
      );
      dispatch(slice.actions.getMailsSuccess(response.data.content));
    } catch (error) {
      dispatch(slice.actions.getMailsFailure(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getMail(mailId: string) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(API_ENDPOINTS.mail.details, {
        params: {
          mailId,
        },
      });
      dispatch(slice.actions.getMailSuccess(response.data.mail));
    } catch (error) {
      console.error(error);
    }
  };
}
