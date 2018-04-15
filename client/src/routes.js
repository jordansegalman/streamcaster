import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import DeleteAccount from './components/DeleteAccount';
import NotFound from './components/NotFound';
import AppliedRoute from './components/AppliedRoute';

export default ({ childProps }) =>
  <Switch>
    <Route path="/" exact component={Home} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <Route path="/register" exact component={Register} />
    <AppliedRoute path="/account" exact component={Account} props={childProps} />
    <AppliedRoute path="/delete_account" exact component={DeleteAccount} props={childProps} />
    <Route component={NotFound} />
  </Switch>;
