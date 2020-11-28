import React from 'react';
import './App.css';
import './page/MainPage'
import MainPage from './page/MainPage';
import SupportPage from './page/SupportPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const App = () => (
  <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Support">Support</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/Support">
            <Support />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  // <div className="App">
  //   {/* <MainPage /> */}
  //   <SupportPage/>
  //   </div>
);
function Home() {
  return <MainPage/>;
}

function Support() {
  return  <SupportPage/>;
}

export default App;
