import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import DeleteAccount from './components/DeleteAccount';
import Live from './components/Live';
import NotFound from './components/NotFound';
import AppliedRoute from './components/AppliedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

export default ({ childProps }) =>
  <Switch>
    <Route path="/" exact component={Home} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/register" exact component={Register} props={childProps} />
    <AuthenticatedRoute path="/account" exact component={Account} props={childProps} />
    <AuthenticatedRoute path="/delete_account" exact component={DeleteAccount} props={childProps} />
    <AppliedRoute path="/live/:username" exact component={Live} props={childProps} />
    <Route component={NotFound} />
  </Switch>;
