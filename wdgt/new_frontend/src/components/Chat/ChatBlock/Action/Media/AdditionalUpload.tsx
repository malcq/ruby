import React from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';

import { Button } from '../../../../UI/Buttons';
import { IOptionsMedia } from '../../../../../models/chat';
import { IMediaFileOptions } from '../../../../../models/file/BaseFile';
import { getFileTypesOptions } from './utils';

type Props = {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
  onCancel?: () => any;
  onContinue?: () => void;
  disabled?: boolean;
  loading: boolean;
  options: IOptionsMedia;
}
class AdditionalUpload extends React.Component<Props> {
  private fileInputRef = React.createRef<HTMLInputElement>();

  uploadFileOption = memoize((options: IOptionsMedia): IMediaFileOptions => {
    return getFileTypesOptions(options);
  })

  onFileClick = () => {
    if (!this.fileInputRef.current) { return; }
    this.fileInputRef.current.click();
  }

  render() {
    const uploadFileOption = this.uploadFileOption(this.props.options);
    return (
      <StyledContainer>
        <HiddenInput
          type="file"
          accept={uploadFileOption.acceptFileTypes}
          name="file-any"
          onChange={this.props.onChange}
          ref={this.fileInputRef}
        />

        <Button
          onClick={this.onFileClick}
          outlined
          disabled={this.props.disabled}
        >
          Add Uploads
        </Button>
        {!this.props.loading && (
          <ContinueButton
            onClick={this.props.onContinue}
            disabled={this.props.disabled}
          >
            Continue
          </ContinueButton>
        )}
      </StyledContainer>
    )
  }
}

const StyledContainer = styled.div`
   display: flex;
   align-items: flex-end;
   flex-direction: column;

   & > button {
     margin-bottom: ${props => props.theme.distances.actionDistance};
   }

   & > button:last-child {
     margin-bottom: 0;
   }
`;

const ContinueButton = styled(Button)`
  width: 180px;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default AdditionalUpload;
