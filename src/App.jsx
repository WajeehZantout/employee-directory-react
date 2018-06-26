// @flow

import React from 'react';

import { Route, Switch } from 'react-router-dom';

import EmployeesTable from './components/EmployeesTable';
import AddEditEmployee from './components/AddEditEmployee';

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={EmployeesTable} />
      <Route exact path="/new" component={AddEditEmployee} />
      <Route exact path="/:id" component={AddEditEmployee} />
    </Switch>
  </div>
);

export default App;
