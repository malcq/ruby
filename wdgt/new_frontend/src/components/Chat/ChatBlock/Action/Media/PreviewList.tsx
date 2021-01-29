import React from 'react';
import styled from 'styled-components';

import Preview from './Preview';

import { BaseFile } from '../../../../../models/file/BaseFile';

import LoadingBlock from './LoadingBlock';


type PreviewSelectorProps = {
  file: BaseFile,
  onFileRemove: (file: BaseFile) => Promise<any>;
  selected: boolean;
  onPreviewClick: (file: BaseFile) => any;
  onCancelUpload: (file: BaseFile) => any;
  loadingProgress?: number;
  loading: boolean;
};
const PreviewSelector: React.FC<PreviewSelectorProps> = (props) => {
  const {
    file,
    loadingProgress,
    loading,
  } = props;

  const loaderVisible = React.useMemo(() => {
    if (!loading || loadingProgress === undefined) { return false; }

    if (loadingProgress === 100) { return false; };

    return true;
  }, [loadingProgress, loading])

  function onCancelUpload() {
    props.onCancelUpload(file);
  }

  return (
    <>
      <div style={{ display: loaderVisible ? 'none' : 'block' }}>
        <Preview
          file={file}
          onFileRemove={props.onFileRemove}
          selected={props.selected}
          onPreviewClick={props.onPreviewClick}
          loading={props.loading}
        />
      </div>
      {loaderVisible && (
        <LoadingBlock
          onCancel={onCancelUpload}
          progress={loadingProgress}
        />
      )}
    </>

  )

}

type Props = {
  files: BaseFile[],
  onFileRemove: (file: BaseFile) => Promise<any>;
  selected: boolean;
  onPreviewClick: (file: BaseFile) => any;
  onCancelUpload: (file: BaseFile) => any;
  loadingProgress?: number[],
  loading: boolean,
}
const PreviewList: React.FC<Props> = (props) => {
  const {
    files,
    loading,
    loadingProgress = [],
    onPreviewClick,
    onFileRemove,
    selected,
    onCancelUpload,
  } = props;

  return (
    <StyledList selected={props.selected}>
      {files.map((file, index) => {
        const progress = loadingProgress[index];

        return (
          <li key={file.id}>
            <PreviewSelector
              loading={loading}
              file={file}
              loadingProgress={progress}
              onFileRemove={onFileRemove}
              selected={selected}
              onCancelUpload={onCancelUpload}
              onPreviewClick={onPreviewClick}
            />
          </li>
        )
      })}
    </StyledList>
  )
}

type StyledListProps = {
  selected?: boolean,
}
const StyledList = styled.ul<StyledListProps>`
  padding: 0;
  margin: 0;
  /* margin-bottom: 32px; */
  list-style-type: none;

  margin-bottom: ${props => props.selected ? '0px' : '32px'};

  & > li {
    margin-bottom: ${props => props.theme.distances.actionDistance};
  }

  & > li:last-child {
    margin-bottom: 0;
  }
`;


export default PreviewList;
