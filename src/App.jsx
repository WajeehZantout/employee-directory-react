// @flow

import React from 'react';

import { Route, Switch } from 'react-router-dom';

import EmployeesTable from './containers/EmployeesTable';
import EmployeeForm from './containers/EmployeeForm';

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={EmployeesTable} />
      <Route exact path="/new" component={EmployeeForm} />
      <Route exact path="/:id" component={EmployeeForm} />
    </Switch>
  </div>
);

export default App;
