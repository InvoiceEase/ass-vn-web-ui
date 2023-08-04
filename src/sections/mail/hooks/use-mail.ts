import { useCallback } from 'react';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
// routes
import { paths } from 'src/routes/paths';
// components
import { readMail } from 'src/redux/slices/mail';
import { useRouter, useSearchParams } from 'src/routes/hook';

// ----------------------------------------------------------------------

export const LABEL_INDEX = 'inbox';

const baseUrl = paths.dashboard.mail;

export default function useMail() {
  const router = useRouter();

  const dispatch = useDispatch();

  const searchParams = useSearchParams();

  const labelParam = searchParams.get('label') || LABEL_INDEX;

  const mailParam = searchParams.get('id');

  const { mails, labels, mailsStatus, labelsStatus } = useSelector((state) => state.mail);

  const mail = useSelector((state) => state.mail.mails.byId[`${mailParam}`]);

  const onClickMail = useCallback(
    async (mailId: string) => {
      const href =
        labelParam !== LABEL_INDEX
          ? `${baseUrl}?id=${mailId}&label=${labelParam}`
          : `${baseUrl}?id=${mailId}`;

      router.push(href);
      dispatch(readMail(mailId));
    },
    [labelParam, router]
  );

  const onClickNavItem = useCallback(
    (labelId: string) => {
      if (labelId) {
        const href = labelId !== LABEL_INDEX ? `${baseUrl}?label=${labelId}` : baseUrl;
        router.push(href);
      }
    },

    [router]
  );

  return {
    // redux
    mail,
    mails,
    labels,
    mailsStatus,
    labelsStatus,
    //
    labelParam,
    mailParam,
    //
    onClickMail,
    onClickNavItem,
  };
}
