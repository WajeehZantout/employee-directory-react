// @flow

import React from 'react';

import { Route } from 'react-router-dom';

import EmployeesTable from './components/EmployeesTable';

const App = () => (
  <div>
    <Route exact path="/" component={EmployeesTable} />
  </div>
);

export default App;
