import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import auditorReducer from './slices/auditor';
import businessReducer from './slices/business';
import calendarReducer from './slices/calendar';
import chatReducer from './slices/chat';
import invoiceReducer from './slices/invoices';
import kanbanReducer from './slices/kanban';
import mailReducer from './slices/mail';
import productReducer from './slices/product';
import profileReducer from './slices/profile';
import providerReducer from './slices/provider';

// ----------------------------------------------------------------------

export const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

export const storage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['checkout'],
};

export const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  kanban: kanbanReducer,
  calendar: calendarReducer,
  product: persistReducer(productPersistConfig, productReducer),
  business: businessReducer,
  profile: profileReducer,
  invoice: invoiceReducer,
  provider: providerReducer,
  auditor: auditorReducer,
});
