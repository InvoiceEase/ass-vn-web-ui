// sections
import UploadView from 'src/sections/_examples/extra/upload-view';
import { IMail } from 'src/types/mail';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Extra: Upload',
};

type Props = {
  mail: IMail;
};

export default function UploadPage({mail}:Props) {
  return <UploadView  mail={mail}/>;
}
