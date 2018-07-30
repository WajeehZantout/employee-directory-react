// @flow

import * as React from 'react';

import { TEL_PATTERN } from '../../constants';

type Props = {
  label: string,
  name: string,
  value: string,
  type: string,
  onChange: Function,
  children: React.Node,
};

const FormInput = ({
  label, name, value, type, onChange, children,
}: Props) => (
  <div className="form-group">
    <label className="text-white" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      type={type}
      pattern={type === 'tel' ? TEL_PATTERN : null}
      className="form-control"
      value={value}
      onChange={onChange}
    />
    {children}
  </div>
);

export default FormInput;
