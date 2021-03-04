import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Test from "./pages/test";
import Setup from "./pages/setup";
import Login from "./pages/login";
import ContextProviders from "./contexts";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas);
library.add(fab);

function App() {
  return (
    <div className="App">
      <ContextProviders>
        <Router>
          <Route path="/" exact component={Test}/>
          <Route path="/setup" exact component={Setup}/>
          <Route path="/login" exact component={Login}/>
        </Router>
      </ContextProviders>
    </div>
  );
}

export default App;
