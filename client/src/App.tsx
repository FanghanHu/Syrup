import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Setup from "./pages/setup";
import Login from "./pages/login-page";
import ContextProviders from "./contexts";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import MainMenu from "./pages/main-menu";
import Order from "./pages/order";
import CustomerSelection from "./pages/customer-selection";
import TableSelection from "./pages/table-selection";
import Recall from "./pages/recall";
import Payment from "./pages/payment";
import Report from "./pages/report";
import LandingPage from "./pages/landing-page";

library.add(fas);
library.add(fab);

function App() {
  return (
    <div className="App">
      <ContextProviders>
        <Router>
          <Route path="/" exact component={LandingPage}/>
          <Route path="/setup" component={Setup}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/main-menu" exact component={MainMenu}/>
          <Route path="/order" exact component={Order}/>
          <Route path="/customer" exact component={CustomerSelection}/>
          <Route path="/table" exact component={TableSelection}/>
          <Route path="/recall" exact component={Recall}/>
          <Route path="/payment" exact component={Payment}/>
          <Route path="/report" exact component={Report}/>
        </Router>
      </ContextProviders>
    </div>
  );
}

export default App;
