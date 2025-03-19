import type { ReactNode } from 'react';
import classNames from 'classnames';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ButtonTypes = ['default', 'link'] as const;
export type ButtonType = (typeof ButtonTypes)[number];

export interface BaseButtonProps {
  /** Set button type, default is 'default' */
  type?: ButtonType;
  className?: string;
  /** Adjust button width to match parent width */
  block?: boolean;
  children?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  [key: `data-${string}`]: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

type MergedHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLElement> &
    React.ButtonHTMLAttributes<HTMLElement> &
    React.AnchorHTMLAttributes<HTMLElement>,
  'type' | 'color'
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  /** URL to navigate to when clicked */
  href?: string;
  /** Equivalent to anchor tag's target attribute, works when href is present */
  target?: string;
}

const Button = (props: ButtonProps) => {
  const {
    type = 'default',
    children,
    className,
    disabled = false,
    block = false,
    onClick,
    ...rest
  } = props;

  const classes = classNames(
    'sb-button',
    {
      block: block,
      'inline-block': !block,
      [`sb-button-${type}`]: type,
    },
    className,
  );

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>,
  ) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    (
      onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
    )?.(e);
  };

  if (rest.href) {
    return (
      <a
        {...rest}
        className={classes}
        href={disabled ? undefined : rest.href}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button {...rest} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
