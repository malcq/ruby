import React, {
  PureComponent,
  ReactNode,
  ReactNodeArray,
  RefObject,
} from 'react';
import { Popper, ClickAwayListener } from '@material-ui/core';
import { v4 as getID } from 'uuid';
import bind from 'autobind-decorator';

import { Button } from '../';
import './styles.scss';

export type IMenuOriginRender = (props: IMenuOriginProps) => ReactNode | null;

export interface IMenuOriginProps{
  key: string;
  'aria-owns'?: string | null;
  'aria-haspopup'?: 'true' | 'false';
  anchorRef: RefObject<any>;
  isHighlighted?: boolean;
  onClick: () => void;
}

interface IMenuButtonProps{
  title?: string,
  className?: string,
  menuClassName?: string,
  placement?: any,
  buttonColor?: string,
  buttonColorActive?: string,
  isOpen?: boolean,
  isActive?: boolean,
  onOpen?: () => void,
  onClose?: () => void,
  onCancel?: () => void,
  onClick?: () => void,
  onClickAway?: ()=> void,
  children?: ReactNode | ReactNodeArray,
  renderOrigin?: IMenuOriginRender,
}

interface IMenuButtonState {
  anchorEl: HTMLElement | null,
  screenWidth: number,
}

const MAX_MOBILE_SCREEN_WIDTH = 768;

class MenuButton extends PureComponent<IMenuButtonProps, IMenuButtonState> {

  public static propTypes = {};

  public static defaultProps = {
    title: '',
    className: '',
    menuClassName: '',
    buttonColor: 'grey-outline-green',
    buttonColorActive: 'green',
    isOpen: true,
    isActive: false,
    onOpen: null,
    onClose: null,
    onCancel: null,
    onClick: null,
    onClickAway: null,
    children: '',
    renderOrigin: null,
  };

  private id: string;
  private buttonRef: RefObject<HTMLElement>;

  constructor(props, context) {
    super(props, context);
    this.id = `MenuButton_${getID()}`;
    this.buttonRef = React.createRef<HTMLElement>();
    this.state = {
      anchorEl: null,
      screenWidth: MAX_MOBILE_SCREEN_WIDTH + 9000,
    }
  }


  public render () {
    const {
      buttonColor,
      buttonColorActive,
      className,
      menuClassName,
      isActive,
      renderOrigin
    } = this.props;
    const { anchorEl, screenWidth } = this.state;
    const isOpen = !!anchorEl;
    const isHighlighted = isOpen || isActive;
    const mobileMenuWidth = (screenWidth < MAX_MOBILE_SCREEN_WIDTH)
      ? { width: `${screenWidth * 0.88}px`}
      : undefined;

    return [
      renderOrigin
        ? renderOrigin({
          key: `${this.id}.OpenMenu`,
          'aria-owns': isOpen ? this.id : null,
          'aria-haspopup': "true",
          anchorRef: this.buttonRef,
          isHighlighted,
          onClick: this.toggle,
        })
        : (
          <Button
            key={`${this.id}.OpenMenu`}
            aria-owns={isOpen ? this.id : null}
            aria-haspopup="true"
            buttonRef={this.buttonRef}
            className={`menu-button ${isHighlighted ? '' :'menu-button_hoverable'} ${className}`}
            color={isHighlighted ? buttonColorActive : buttonColor}
            onClick={this.toggle}
          >
            {this.props.title}
            {(isActive) && (
              <i
                className="menu-button__icon icon close"
                onClick={this.cancel}
              />
            )}
          </Button>
        ),
      <Popper
        key={`${this.id}.Popper`}
        id={this.id}
        open={isOpen}
        anchorEl={anchorEl}
        placement={this.props.placement || "bottom-start"}
        className="menu-button__popper mui-override"

        modifiers={{
          flip: {
            enabled: false,
          },
        }}
      >
        <ClickAwayListener onClickAway={this.close}>
          <section
            className={`menu-button__menu ${menuClassName}`}
            style={mobileMenuWidth}
          >
            {this.props.children}
          </section>
        </ClickAwayListener>
      </Popper>
    ];
  }

  public componentDidUpdate(prevProps: IMenuButtonProps): void {
    const { isOpen } = this.props;
    if (isOpen != null && prevProps.isOpen !== isOpen) {
      if (isOpen) {
        this.open(this.buttonRef.current)
      } else {
        this.close()
      }
    }
  }

  @bind
  private toggle(event?: any): void {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
    if (this.state.anchorEl) {
      this.close()
    } else {
      this.open(event.target)
    }
  }
  
  @bind
  private close(): void {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
    this.setState({ anchorEl: null });
  }

  @bind
  private open(target: HTMLElement | null): void {
    const { onOpen } = this.props;
    if (onOpen) {
      onOpen();
    }
    this.setState({
      anchorEl: target,
      screenWidth: window.innerWidth,
    });
  }

  @bind
  private cancel(event: any): void{
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
    if(event){
      event.stopPropagation();
    }
    this.close()
  }
}

export default MenuButton;
