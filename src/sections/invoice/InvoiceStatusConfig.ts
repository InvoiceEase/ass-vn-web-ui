import { LabelColor } from 'src/components/label';

export const InvoiceStatusConfig = {
  approved: { name: 'DA_DUYET', status: 'Đã duyệt', color: 'success' as LabelColor },
  authenticated: { name: 'DA_XAC_THUC', status: 'Đã xác thực', color: 'warning' as LabelColor },
  unauthenticated: {
    name: 'CHUA_XAC_THUC',
    status: 'Chưa xác thực',
    color: 'primary' as LabelColor,
  },
  unapproved: { name: 'KHONG_DUYET', status: 'Không duyệt', color: 'error' as LabelColor },
  notAuthenticated: {
    name: 'KHONG_XAC_THUC',
    status: 'Không xác thực',
    color: 'default' as LabelColor,
  },
  wrong: { name: 'SAI_THONG_TIN', status: 'Sai thông tin', color: 'error' as LabelColor },
};
