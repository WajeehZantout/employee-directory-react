// @flow

import * as React from 'react';

type Props = {
  className: string,
  children: React.Node,
  onClick: Function,
};

const Button = ({ className, onClick, children }: Props) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
);

export default Button;
