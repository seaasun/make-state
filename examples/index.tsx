import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';
import {RecoilRoot} from 'recoil'

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot >
      <Main />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
