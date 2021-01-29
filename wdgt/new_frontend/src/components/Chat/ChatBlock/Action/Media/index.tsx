import React from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { CSSTransition } from 'react-transition-group';

import PreviewList from './PreviewList';
import TypeSelector from './TypeSelector';
import AdditionalUpload from './AdditionalUpload';

import { BaseFile } from '../../../../../models/file/BaseFile';
import { getLocalFile } from '../../../../../models/file/factories';

import {
  IAction,
  ISelectedAction,
  ISelectedState,
  IStateFile,
  IOptionsMedia,
} from '../../../../../models/chat';
import { getActionState } from '../../../../../utils';
import { EActionStates } from '../../../../../utils/constants';
import CancelableWithPromise from '../../../../../utils/cancelable-with-promise';
import AutoresizeInput from '../../../../UI/AutoresizeInput';
import { Button } from '../../../../UI/Buttons';

import {
  uploadAll,
} from '../../../../../api/files';

enum SelectedScreen {
  FILES = 'files',
  TEXT = 'text',
  SELECT = 'select',
}

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: ISelectedState) => Promise<any>;
  onRollbackAction: (action: IAction) => void;
};
type State = {
  files: BaseFile[],
  loading: boolean,
  loadingProgress?: number[],
  textValue: string,
  selectedScreen: SelectedScreen,
}
class MediaAction extends React.Component<Props, State> {
  upload: CancelableWithPromise<void> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = getInitialState(props);
  }

  isSelected = memoize((action: IAction, selected: ISelectedAction | undefined): boolean => {
    const state = getActionState(action, selected);
    if (state !== EActionStates.pristine) { return true; }
    return false;
  })

  placeholder = memoize((action: IAction): string => {
    const options: IOptionsMedia = action.options;
    const placeholder = options?.text?.placeholder ?? '';
    return placeholder;
  });

  mapFileStateToRedux = (newFiles: BaseFile[]): IStateFile => {
    return {
      files: newFiles,
    }
  }

  mapTextStateToRedux = (text: string): IStateFile => {
    return {
      text,
    }
  }

  onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) { return; }
    const file = event.target.files[0]
    const instance = await getLocalFile(file);

    const newFiles = [
      ...this.state.files,
      instance,
    ];

    this.setState({
      files: newFiles,
      selectedScreen: SelectedScreen.FILES,
    })
  }

  onFileRemove = async (file: BaseFile): Promise<any> => {
    await file.cleanFileData();

    const newFiles = this.state.files.filter((item) => item.id !== file.id);
    const selectedScreen: SelectedScreen = newFiles.length > 0
      ? SelectedScreen.FILES
      : SelectedScreen.SELECT;
    this.setState({
      files: newFiles,
      selectedScreen,
    })
  };

  onSubmitFiles = async (): Promise<any> => {
    this.setState({ loading: true })

    const newFiles = [...this.state.files];
    try {
      await new Promise<void>((resolve, reject) => {
        this.upload = uploadAll(newFiles, (status) => {
          this.setState(prevState => ({
            loadingProgress: status,
          }))
        });
        this.upload.promise.then(resolve, reject);
      });
      const state = this.mapFileStateToRedux(newFiles);
      this.props.onActionReply(this.props.action, state);
      this.setState({ loading: false, loadingProgress: undefined, })
    } catch (err) {
      this.setState({
        files: newFiles,
        loading: false,
        loadingProgress: undefined,
      })
    }
  }

  onTextChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const value = ev.currentTarget.value;
    this.setState({ textValue: value });
  }

  onTextSend = (value: string) => {
    const state = this.mapTextStateToRedux(value);
    this.props.onActionReply(this.props.action, state);
  }

  onCancel = (): void => {
    if(this.upload) {
      this.upload.cancel();
    }
  }

  onTextSelectClick = () => {
    this.setState({
      selectedScreen: SelectedScreen.TEXT,
    });
  }

  onPreviewClick = (file: BaseFile): void => {
    const isSelected = this.isSelected(this.props.action, this.props.selected);

    if (isSelected) {
      this.props.onRollbackAction(this.props.action);
    }
  }

  onAreaClick = () => {
    // if (selectedState && !disabled) {
      return this.props.onRollbackAction(this.props.action);
    // }
  }

  render() {
    const isSelected = this.isSelected(this.props.action, this.props.selected);
    const inputPlaceholder = this.placeholder(this.props.action);
    const {
      selectedScreen,
    } = this.state;

    return (
      <StyledContainer
        textScreen={selectedScreen === SelectedScreen.TEXT}
        selected={isSelected}
      >
        {selectedScreen === SelectedScreen.FILES && (
          <PreviewList
            files={this.state.files}
            onFileRemove={this.onFileRemove}
            selected={isSelected}
            onPreviewClick={this.onPreviewClick}
            loading={this.state.loading}
            loadingProgress={this.state.loadingProgress}
            onCancelUpload={this.onCancel}
          />
        )}


        {!isSelected && selectedScreen === SelectedScreen.FILES && this.state.files.length > 0 && (
            <AdditionalUpload
              onChange={this.onInputChange}
              onContinue={this.onSubmitFiles}
              disabled={this.state.loading}
              loading={this.state.loading}
              onCancel={this.onCancel}
              options={this.props.action.options as IOptionsMedia}
            />
        )}

        {!isSelected && selectedScreen === SelectedScreen.SELECT && (
          <TypeSelector
            onChange={this.onInputChange}
            onTextClick={this.onTextSelectClick}
            options={this.props.action.options as IOptionsMedia}
          />
        )}

        <CSSTransition
          in={isSelected && selectedScreen === SelectedScreen.TEXT}
          classNames="my-node"
          timeout={{
            exit: 0,
            enter: 700
          }}
          unmountOnExit
        >
          <StyledButton
            outlined
            onClick={this.onAreaClick}
            color="selected"
          >
            {this.state.textValue}
          </StyledButton>
        </CSSTransition>

        {!isSelected && selectedScreen === SelectedScreen.TEXT && (
          <StyledAutoresizeInput
            value={this.state.textValue}
            maxRows={4}
            onChange={this.onTextChange}
            onSend={this.onTextSend}
            autofocus
            placeholder={inputPlaceholder}
          />
        )}
      </StyledContainer>
    );
  }
}

type StyledContainerProps = {
  textScreen?: boolean;
  selected?: boolean;
};
const StyledContainer = styled.div<StyledContainerProps>`
  display: flex;
  padding: 0 24px;
  flex-direction: ${props => props.textScreen ? 'row' : 'column'};
  justify-content: ${props => props.selected && props.textScreen ? 'flex-end' : null};
  align-items: ${props => props.selected && props.textScreen ? null : 'flex-end'};

  & > button {
    margin-bottom: ${props => props.theme.distances.actionDistance};
  }

  & > button:last-child {
    margin-bottom: 0px;
  }
`;

const StyledAutoresizeInput = styled(AutoresizeInput)`
  flex-grow: 1;
  transition: width 2000ms;
`;

const StyledButton = styled(Button)`
  white-space: pre-wrap;
  text-align: left;
  transition: 0.7s;
  width: auto;

  &.my-node-enter {
    max-width: 100%;
    flex-grow: 1;
  }

  &.my-node-enter-active {
    flex-grow: 0;
  }
`;


export default MediaAction;

function getInitialFiles(props: Props): BaseFile[] {
  const { selected, action } = props;
  if (!selected) { return [] }

  if (selected.actionId !== action.id) { return []; }

  if (!selected.state) {
    return [];
  }

  const state = selected.state as IStateFile;

  if (!state.files) { return []; }

  return state.files;
}

function getInitialText(props: Props): string {
  const { selected, action } = props;
  if (!selected) { return ''; }
  if (selected.actionId !== action.id) { return ''; }
  if (!selected.state) { return ''; }

  const state = selected.state as IStateFile;

  if (!state.text) { return ''; }
  return state.text;
}

function getInitialSelectedScreen(files: BaseFile[], text: string): SelectedScreen {
  if (files.length > 0) { return SelectedScreen.FILES; }
  if (text.length > 0) { return SelectedScreen.TEXT; }
  return SelectedScreen.SELECT;
}

function getInitialState(props: Props): State {

  const files = getInitialFiles(props);
  const text = getInitialText(props);
  const selectedScreen = getInitialSelectedScreen(files, text);

  return {
    files,
    loading: false,
    loadingProgress: undefined,
    textValue: text,
    selectedScreen: selectedScreen,
  }
}