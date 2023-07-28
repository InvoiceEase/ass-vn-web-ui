import { LabelColor } from 'src/components/label';

export const InvoiceStatusConfig = {
  approved: { status: 'Đã duyệt', color: 'success' as LabelColor },
  authenticated: { status: 'Đã xác thực', color: 'warning' as LabelColor },
  unauthenticated: { status: 'Chưa xác thực', color: 'primary' as LabelColor },
  unapproved: { status: 'Không duyệt', color: 'error' as LabelColor },
  wrong: { status: 'Sai thông tin', color: 'default' as LabelColor },
};
