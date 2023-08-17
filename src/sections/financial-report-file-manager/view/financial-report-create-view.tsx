'use client';

// @mui
import Container from '@mui/material/Container';
// routes
// components
import { useSettingsContext } from 'src/components/settings';
import FinancialReportNewEditForm from '../financial-report-new-edit-form';
//

import { useEffect, useState } from 'react';
import { useSelector } from 'src/redux/store';
import { useParams } from 'src/routes/hook';
import { IFinancialFile } from 'src/types/financial';

// ----------------------------------------------------------------------

export default function FinancialReportCreateView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { year, quarter } = params;

  const [files, setFiles] = useState<IFinancialFile[]>([]);

  const filesInRedux = useSelector((state) => state.financial.files);

  useEffect(() => {
    if (params) {
      const updateFiles = filesInRedux.filter(
        (item) => item.year === year && item.quarter === quarter
      );
      setFiles(updateFiles);
    }
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <CustomBreadcrumbs
        heading="Create a new user"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: 'New user' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      /> */}

      <FinancialReportNewEditForm year={year} quarter={quarter} files={files} />
    </Container>
  );
}
