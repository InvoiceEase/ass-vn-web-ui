import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

export const API_ENDPOINTS = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/v1/mails',
    details: '/api/v1/mails',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  business: {
    list: '/api/v1/businesses',
    types: '/api/v1/businessTypes',
  },
  profile: {
    business: '/api/v1/businesses',
  },
  invoice: {
    list: '/api/v1/invoices/filter',
    export: '/api/v1/invoices/export',
    details: '/api/v1/invoices/',
  },
  provider: {
    list: '/api/v1/providers/business',
    create: '/api/v1/providers',
  },
  users: {
    list: '/api/v1/users/filter',
    detail: '/api/v1/users/',
    listAuditors: '/api/v1/audits/auditors',
  },
  financial: {
    folders: '/api/v1/files/reports/storage',
    files: '/api/v1/files/reports/storage/financial',
  },
  tax: {
    files: '/api/v1/files/reports/storage/tax',
  },
  dashboard: {
    businesses: '/api/v1/dashboard/businesses/',
    admin: '/api/v1/dashboard/admin/',
  },
};
