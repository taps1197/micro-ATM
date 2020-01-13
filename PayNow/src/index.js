import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import history from "./constant/history";

import { Router, Route } from "react-router-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import reducers from "./reducers";
import ReduxPromise from "redux-promise";

const store = createStore(reducers, applyMiddleware(logger, ReduxPromise));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById("root")
);
