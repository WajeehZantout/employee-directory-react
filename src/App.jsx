// @flow

import React from 'react';

import { Route } from 'react-router-dom';

import EmployeesTable from './components/EmployeesTable';
import AddEditEmployee from './components/AddEditEmployee';

const App = () => (
  <div>
    <Route exact path="/" component={EmployeesTable} />
    <Route exact path="/new" component={AddEditEmployee} />
  </div>
);

export default App;
