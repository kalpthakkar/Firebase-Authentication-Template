// import logo from '../logo.svg'
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import AnonymousLoggerRoute from './components/AnonymousLoggerRoute'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import Root from './components/Root';
import Dashboard from './components/Dashboard'
import Signup from './components/Signup'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import UpdateProfile from './components/UpdateProfile'
import AccountActions from './components/AccountActions'
import Policy from './components/Policy'
import dataDeletion from './components/dataDeletion'
import SocialSignOn from './components/SocialSignOn'

function App() {
  return (
    <div>
      <h2>I'm Global</h2>
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path='/' component={Root} />
            <Route path='/policy' component={Policy} />
            <Route path='/data-deletion' component={dataDeletion} />
            <Route path='/account/actions' component={AccountActions} />
            <PrivateRoute path='/dashboard' component={Dashboard} />
            <PrivateRoute path='/update-profile' component={UpdateProfile} />
            <Route path={["/login", "/signup"]}>
              <AnonymousLoggerRoute path='/signup' component={Signup} /> 
              <AnonymousLoggerRoute path='/login' component={Login} /> 
              <SocialSignOn />
            </Route>
            <AnonymousLoggerRoute path='/forgot-password' component={ForgotPassword} /> 
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
