import { useCallback, useEffect, useState } from 'react';
// @mui
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// utils
// types
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { Box, Button, CircularProgress } from '@mui/material';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { getTaxFiles } from 'src/redux/slices/tax';
import { useDispatch, useSelector } from 'src/redux/store';
import FileManagerFileItem from './file-manager-file-item';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { ITaxFile } from 'src/types/tax';
//

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  quarter: any;
  year?: string;
  favorited?: boolean;
  //
  onFavorite?: VoidFunction;
  onCopyLink?: VoidFunction;
  //
  onClose: VoidFunction;
  onDelete: VoidFunction;
};

export default function FileManagerFileDetails({
  quarter,
  year,
  open,
  favorited,
  //
  onFavorite,
  onCopyLink,
  onClose,
  onDelete,
  ...other
}: Props) {
  // const { name, size, url, type, shared, modifiedAt } = item;

  // const hasShared = shared && !!shared.length;

  const reportTypes = ['TAX_INCOME', 'TAX_OUTCOME', 'TAX_RETURN_GTGT', 'TAX_RETURN_TNCN'];

  const toggleTags = useBoolean(true);

  const share = useBoolean();

  const properties = useBoolean(true);

  const [inviteEmail, setInviteEmail] = useState('');

  const [isHistory, setIsHistory] = useState(false);
  const [historyReportType, setHistoryReportType] = useState('');

  const [selected, setSelected] = useState<string[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      dispatch(getTaxFiles(year, quarter));
    }
  }, [year, open]);

  const onSelectItem = (id: string) => {
    if (!selected.includes(id)) {
      setSelected((prevState) => prevState.concat(id));
    } else {
      setSelected((prevState) => prevState.filter((item) => item !== id));
    }
  };

  const files = useSelector((state) => state.tax.files);

  const isLoadingFiles = useSelector((state) => state.tax.filesStatus.loading);

  // const [tags, setTags] = useState(item.tags.slice(0, 3));

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  // const handleChangeTags = useCallback((newValue: string[]) => {
  //   setTags(newValue);
  // }, []);

  const renderTags = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Tags
        <IconButton size="small" onClick={toggleTags.onToggle}>
          <Iconify icon="eva:arrow-ios-upward-fill" />
        </IconButton>
      </Stack>

      {/* {toggleTags.value && (
        <Autocomplete
          multiple
          freeSolo
          options={item.tags.map((option) => option)}
          getOptionLabel={(option) => option}
          defaultValue={item.tags.slice(0, 3)}
          value={tags}
          onChange={(event, newValue) => {
            handleChangeTags(newValue);
          }}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                {...getTagProps({ index })}
                size="small"
                variant="soft"
                label={option}
                key={option}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} placeholder="#Add a tags" />}
        />
      )} */}
    </Stack>
  );

  const getReportTypeName = (reportType: string) => {
    switch (reportType) {
      case 'TAX_RETURN_TNCN':
        return 'Tờ khai thuế thu nhập cá nhân';
      case 'TAX_RETURN_GTGT':
        return 'Tờ khai thuế giá trị gia tăng';
      case 'TAX_OUTCOME':
        return 'Bảng kê đầu ra';
      case 'TAX_INCOME':
        return 'Bảng kê đầu vào';
      default:
        return '';
    }
  };

  const onDownloadFiles = (cloudFilePath: string) => {
    // Create a reference to the file we want to download
    const storage = getStorage();
    // selected.map((fileId) => {
    //   const file = files.filter((_file) => _file.id === fileId)[0];
    const starsRef = ref(storage, cloudFilePath);

    // Get the download URL
    getDownloadURL(starsRef)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        // This can be downloaded directly:
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = 'blob';
        // xhr.onload = (event) => {
        //   const blob = xhr.response;
        // };
        // xhr.open('GET', url);
        // xhr.send();
        saveAs(url);
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;

          default:
            break;
        }
      });
    // });
  };

  const handleHistory = (reportType: string) => {
    setIsHistory(!isHistory);
    setHistoryReportType(reportType);
  };

  const renderHistoryFile = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle1' }}
      >
        <IconButton size="small" onClick={() => handleHistory('')}>
          <Iconify icon="eva:arrow-back-outline" sx={{ width: 26, height: 26 }} />
        </IconButton>
        Lịch sử chỉnh sửa
      </Stack>
      {isLoadingFiles ? (
        <CircularProgress color="primary" />
      ) : (
        // reportTypes.map((reportType) => {
        //   const reportFileAllVersion = files.filter(
        //     (currentFile) => currentFile.reportType === reportType
        //   );

        //   let renderFiles: IFinancialFile[] = [];

        //   if (reportFileAllVersion.length > 1) {
        //     renderFiles = reportFileAllVersion.filter((item) => item.status === 'CURRENT');
        //   } else {
        //     renderFiles = reportFileAllVersion;
        //   }

        //   return renderFiles.map((renderFile) => (
        //     <>
        //       <Divider sx={{ borderStyle: 'dashed' }} />
        //       <Stack
        //         sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        //       >
        //         <Box>
        //           <Typography variant="subtitle2">
        //             {getReportTypeName(renderFile.reportType)}
        //           </Typography>
        //           {reportFileAllVersion.length > 1 && (
        //             <Typography variant="caption">(Đã chỉnh sửa)</Typography>
        //           )}
        //         </Box>
        //         {reportFileAllVersion.length > 1 && (
        //           <IconButton
        //             size="small"
        //             onClick={() => onDownloadFiles(renderFile.cloudFilePath)}
        //           >
        //             <Iconify icon="eva:clock-outline" sx={{ width: 26, height: 26 }} />
        //           </IconButton>
        //         )}
        //       </Stack>
        //       <Stack
        //         sx={{
        //           flexDirection: 'row',
        //           justifyContent: 'space-between',
        //           alignItems: 'center',
        //         }}
        //       >
        //         <FileManagerFileItem
        //           key={renderFile.id}
        //           file={renderFile}
        //           // selected={selected.includes(file.id)}
        //           // onSelect={() => onSelectItem(file.id)}
        //           // onDelete={() => onDeleteItem(file.id)}
        //           sx={{ width: 360 }}
        //         />
        //         <IconButton size="small" onClick={() => handleHistory(renderFile.reportType)}>
        //           <Iconify icon="eva:download-outline" sx={{ width: 26, height: 26 }} />
        //         </IconButton>
        //       </Stack>
        //     </>
        //   ));
        // })
        files
          .filter((item) => item.reportType === historyReportType)
          .map((renderFile) => (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack
                sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="subtitle2">
                  {getReportTypeName(renderFile.reportType)}
                </Typography>
              </Stack>
              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FileManagerFileItem
                  key={renderFile.id}
                  file={renderFile}
                  // selected={selected.includes(file.id)}
                  // onSelect={() => onSelectItem(file.id)}
                  // onDelete={() => onDeleteItem(file.id)}
                  sx={{ width: 360 }}
                />
                <IconButton size="small" onClick={() => onDownloadFiles(renderFile.cloudFilePath)}>
                  <Iconify icon="eva:download-outline" sx={{ width: 26, height: 26 }} />
                </IconButton>
              </Stack>
            </>
          ))
      )}

      {/* {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Size
            </Box>
            {fData(size)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Modified
            </Box>
            {fDateTime(modifiedAt)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Type
            </Box>
            {fileFormat(type)}
          </Stack>
        </>
      )} */}
    </Stack>
  );

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle1' }}
      >
        Các tài liệu
        {/* {selected.length > 0 && (
          <IconButton size="small" onClick={onDownloadFiles}>
            <Iconify icon="eva:download-outline" sx={{ width: 26, height: 26 }} />
          </IconButton>
        )} */}
      </Stack>
      {isLoadingFiles ? (
        <CircularProgress color="primary" />
      ) : (
        reportTypes.map((reportType) => {
          const reportFileAllVersion = files.filter(
            (currentFile) => currentFile.reportType === reportType
          );

          let renderFiles: ITaxFile[] = [];

          if (reportFileAllVersion.length > 1) {
            renderFiles = reportFileAllVersion.filter((item) => item.status === 'CURRENT');
          } else {
            renderFiles = reportFileAllVersion;
          }

          return renderFiles.map((renderFile) => (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack
                sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box>
                  <Typography variant="subtitle2">
                    {getReportTypeName(renderFile.reportType)}
                  </Typography>
                  {reportFileAllVersion.length > 1 && (
                    <Typography variant="caption">(Đã chỉnh sửa)</Typography>
                  )}
                </Box>
                {reportFileAllVersion.length > 1 && (
                  <IconButton size="small" onClick={() => handleHistory(renderFile.reportType)}>
                    <Iconify icon="eva:clock-outline" sx={{ width: 26, height: 26 }} />
                  </IconButton>
                )}
              </Stack>
              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FileManagerFileItem
                  key={renderFile.id}
                  file={renderFile}
                  // selected={selected.includes(file.id)}
                  // onSelect={() => onSelectItem(file.id)}
                  // onDelete={() => onDeleteItem(file.id)}
                  sx={{ width: 360 }}
                />
                <IconButton size="small" onClick={() => onDownloadFiles(renderFile.cloudFilePath)}>
                  <Iconify icon="eva:download-outline" sx={{ width: 26, height: 26 }} />
                </IconButton>
              </Stack>
            </>
          ));
        })
      )}

      {/* {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Size
            </Box>
            {fData(size)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Modified
            </Box>
            {fDateTime(modifiedAt)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Type
            </Box>
            {fileFormat(type)}
          </Stack>
        </>
      )} */}
    </Stack>
  );

  // const renderShared = (
  //   <>
  //     <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
  //       <Typography variant="subtitle2"> File Share With </Typography>

  //       <IconButton
  //         size="small"
  //         color="primary"
  //         onClick={share.onTrue}
  //         sx={{
  //           width: 24,
  //           height: 24,
  //           bgcolor: 'primary.main',
  //           color: 'primary.contrastText',
  //           '&:hover': {
  //             bgcolor: 'primary.dark',
  //           },
  //         }}
  //       >
  //         <Iconify icon="mingcute:add-line" />
  //       </IconButton>
  //     </Stack>

  //     {hasShared && (
  //       <Box sx={{ pl: 2.5, pr: 1 }}>
  //         {shared.map((person) => (
  //           <FileManagerInvitedItem key={person.id} person={person} />
  //         ))}
  //       </Box>
  //     )}
  //   </>
  // );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: '30vw' },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6"> Thông tin </Typography>

            {/* <Checkbox
              color="warning"
              icon={<Iconify icon="eva:star-outline" />}
              checkedIcon={<Iconify icon="eva:star-fill" />}
              checked={favorited}
              onChange={onFavorite}
            /> */}
          </Stack>

          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{
              p: 2.5,
              bgcolor: 'background.neutral',
            }}
          >
            {/* <FileThumbnail
              imageView
              file={type === 'folder' ? type : url}
              sx={{ width: 64, height: 64 }}
              imgSx={{ borderRadius: 1 }}
            /> */}

            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
              {quarter} - {`Năm ${year}`}
            </Typography>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* {renderTags} */}

            {isHistory ? renderHistoryFile : renderProperties}
          </Stack>

          {/* {renderShared} */}
        </Scrollbar>

        {!isHistory && (
          <Box sx={{ p: 2.5 }}>
            <Button
              fullWidth
              size="large"
              component={RouterLink}
              href={paths.dashboard.file.tax.update(year ?? '', quarter.split(' ')[1])}
              variant="contained"
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            >
              Cập nhật
            </Button>
          </Box>
        )}
      </Drawer>

      {/* <FileManagerShareDialog
        open={share.value}
        shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={onCopyLink}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      /> */}
    </>
  );
}
