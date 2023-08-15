import { useCallback, useRef, useState } from 'react';
// @mui
// types
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { TableProps } from 'src/components/table';
//
import { Box, Divider } from '@mui/material';
import { IFinancialFolder } from 'src/types/financial';
import FileManagerFolderItem from './file-manager-folder-item';
import FileManagerPanel from './file-manager-panel';

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  data: IFinancialFolder[];
  dataFiltered: IFinancialFolder[];
  onOpenConfirm: VoidFunction;
  onDeleteItem?: (id: string) => void;
};

export default function FileManagerGridView({
  table,
  data,
  dataFiltered,
  onDeleteItem,
  onOpenConfirm,
}: Props) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const containerRef = useRef(null);

  const [folderName, setFolderName] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');

  const share = useBoolean();

  const newFolder = useBoolean();

  const upload = useBoolean();

  const files = useBoolean();

  const folders = useBoolean();

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  }, []);

  console.log('NghiaLog: tableData - ', data);

  return (
    <>
      <Box ref={containerRef}>
        {dataFiltered.map((folder) => (
          <>
            <FileManagerPanel
              title={`Năm ${folder.year}`}
              // onOpen={newFolder.onTrue}
              // collapse={folders.value}
              // onCollapse={folders.onToggle}
            />

            {/* <Collapse in={!folders.value} unmountOnExit> */}
            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
            >
              {folder.quarter
                // .filter((i) => i.type === 'folder')
                .map((quarterFolder) => (
                  <FileManagerFolderItem
                    key={quarterFolder}
                    folder={`Quý ${quarterFolder}`}
                    year={folder.year}
                    selected={selected.includes(quarterFolder)}
                    onSelect={() => onSelectItem(quarterFolder)}
                    // onDelete={() => onDeleteItem(folder.year)}
                    sx={{ maxWidth: 'auto' }}
                  />
                ))}
            </Box>
            {/* </Collapse> */}

            <Divider sx={{ my: 5, borderStyle: 'dashed' }} />
          </>
        ))}
        {/*
        <FileManagerPanel
          title="Files"
          subTitle={`${data.filter((item) => item.type !== 'folder').length} files`}
          onOpen={upload.onTrue}
          collapse={files.value}
          onCollapse={files.onToggle}
        />

        <Collapse in={!files.value} unmountOnExit>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={3}
          >
            {dataFiltered
              .filter((i) => i.type !== 'folder')
              .map((file) => (
                <FileManagerFileItem
                  key={file.id}
                  file={file}
                  selected={selected.includes(file.id)}
                  onSelect={() => onSelectItem(file.id)}
                  onDelete={() => onDeleteItem(file.id)}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}
          </Box>
        </Collapse> */}

        {/* {!!selected?.length && (
          <FileManagerActionSelected
            numSelected={selected.length}
            rowCount={data.length}
            selected={selected}
            onSelectAllItems={(checked) =>
              onSelectAllItems(
                checked,
                data.map((row) => row.id)
              )
            }
            action={
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={onOpenConfirm}
                  sx={{ mr: 1 }}
                >
                  Delete
                </Button>

                <Button
                  color="primary"
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="solar:share-bold" />}
                  onClick={share.onTrue}
                >
                  Share
                </Button>
              </>
            }
          />
        )} */}
      </Box>

      {/* <FileManagerShareDialog
        open={share.value}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      /> */}

      {/* <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} /> */}

      {/* <FileManagerNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="New Folder"
        onCreate={() => {
          newFolder.onFalse();
          setFolderName('');
          console.info('CREATE NEW FOLDER', folderName);
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
      /> */}
    </>
  );
}
