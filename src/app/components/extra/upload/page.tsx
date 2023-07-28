// sections
import UploadView from 'src/sections/_examples/extra/upload-view';
import { IMail } from 'src/types/mail';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Extra: Upload',
};

type Props = {
  mail: IMail;
  onClickCancel:()=>null;
};

export default function UploadPage({mail, onClickCancel}:Props) {
  return <UploadView  mail={mail} onClickCancel={onClickCancel}/>;
}
