import { createSlice, Dispatch } from '@reduxjs/toolkit';
import keyBy from 'lodash/keyBy';
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
  pagination: {
    numberOfElements: 0,
    page: 0,
    totalElements: 0,
    totalPages: 0,
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
      const mails = action.payload.content;

      state.mailsStatus.loading = false;
      state.mailsStatus.empty = !mails.length;
      state.mailsStatus.error = null;

      state.mails.byId = keyBy(mails, 'id');
      state.mails.allIds = Object.keys(state.mails.byId);

      state.pagination = {
        numberOfElements: action.payload.numberOfElements,
        page: action.payload.number,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
      };
    },

    // GET MAIL
    getMailSuccess(state, action) {
      const mail = action.payload;

      state.mails.byId[mail.id] = mail;
      if (!state.mails.allIds.includes(mail.id)) {
        state.mails.allIds.push(mail.id);
      }
    },

    // READ MAIL
    readMail(state, action) {
      const mail = action.payload;

      state.mails.byId[mail.id] = mail;
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

export function getMails(businessId: string | null, searchQuery?: string | null, page?: number) {
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
      sessionStorage.setItem('totalMailPage', response.data.totalPages);
      if (page) {
        sessionStorage.setItem('currentMailPage', page.toString());
      } else {
        sessionStorage.setItem('currentMailPage', '0');
      }
      dispatch(slice.actions.getMailsSuccess(response.data));
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

export function readMail(mailId: string) {
  return async (dispatch: Dispatch) => {
    try {
      const token = sessionStorage.getItem('token');

      const accessToken: string = `Bearer ${token}`;

      const headersList = {
        accept: '*/*',
        Authorization: accessToken,
      };
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.mail.list}/${mailId}`,
        {},
        { headers: headersList }
      );

      dispatch(slice.actions.readMail(response.data));
    } catch (error) {}
  };
}
