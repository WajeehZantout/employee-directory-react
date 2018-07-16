// @flow

import React from 'react';

import { Route, Switch } from 'react-router-dom';

import EmployeesTable from './containers/EmployeesTable';
import EmployeeDetails from './containers/EmployeeDetails';

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={EmployeesTable} />
      <Route exact path="/new" component={EmployeeDetails} />
      <Route exact path="/:id" component={EmployeeDetails} />
    </Switch>
  </div>
);

export default App;
