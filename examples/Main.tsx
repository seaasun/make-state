import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

// import Simple from './Simple'
import StateNumber from './StateNumber'
// import StateUndefind from './StateUndefind'
// import StateObject from './StateObject'
// import StateFunction from './StateFunction'
// import Lab from './lab'

function Main () {
    return <Router>
       
       <Switch>
           {/* <Route path = "/simple"><Simple /></Route>
           <Route path = "/lab"><Lab /></Route> */}
           <Route path = "/StateNumber"><StateNumber /></Route>
           {/* <Route path = "/StateObject"><StateObject /></Route>
           <Route path = "/StateFunction"><StateFunction /></Route> */}
       </Switch>
    </Router>
}

export default Main

/**
 * 测试用例：
 * 1. makeState(number) 
 * 2. makeState(object)
 * 3. makeState(undefind)
 * 4. makeState(makeState)
 * 5. makeState(function)
 * 6. makeState(function, function)
 * 
 * 
 * 
 */