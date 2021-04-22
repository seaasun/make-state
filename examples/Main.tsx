import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import Simple from './Simple'
import Lab from './lab'

function Main () {
    return <Router>
       
       <Switch>
           <Route path = "/simple"><Simple /></Route>
           <Route path = "/lab"><Lab /></Route>
       </Switch>
    </Router>
}

export default Main