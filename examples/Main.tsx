import React, {lazy, Suspense} from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

const StateNumber = lazy(() => import('./StateNumber'))
// const StateUndefind = lazy(() => import('./StateUndefind'))
// const StateObject = lazy(() => import('./StateObject'))
// const StateFunction = lazy(() => import('./StateFunction'))
// const StateLazy = lazy(() => import('./StateLazy'))
// const StateFunctionFunction = lazy(() => import('./StateFunctionFunction'))

// const StatesNumber = lazy(() => import('./StatesNumber'))
// const StatesObject = lazy(() => import('./StatesObject'))
// const StatesUndefind = lazy(() => import('./StatesUndefind'))
// const StatesFunction = lazy(() => import('./StatesFunction'))
// const StatesFunctionFunction = lazy(() => import('./StatesFunctionFunction'))

const Fallback = () => <div></div>

function Main () {
    return <Router>
      <Suspense fallback = {<Fallback />}>
        <Switch>
            {/* <Route path = "/simple"><Simple /></Route>
            <Route path = "/lab"><Lab /></Route> */}
            <Route path = "/StateNumber"><StateNumber /></Route>
            {/* <Route path = "/StateUndefind"><StateUndefind /></Route>
            <Route path = "/StateObject"><StateObject /></Route>
            <Route path = "/StateLazy"><StateLazy /></Route>
            <Route path = "/StateFunction"><StateFunction /></Route>
            <Route path = "/StateFunctionFunction"><StateFunctionFunction /></Route>

            <Route path = "/StatesNumber"><StatesNumber /></Route>
            <Route path = "/StatesObject"><StatesObject /></Route>
            <Route path = "/StatesUndefind"><StatesUndefind /></Route>
            <Route path = "/StatesFunction"><StatesFunction /></Route>
            <Route path = "/StatesFunctionFunction"><StatesFunctionFunction /></Route> */}
        </Switch>
       </Suspense>
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