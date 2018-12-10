import React, { Component } from "react";
import { Route, Router } from "react-router";
import { Complexity } from "./Complexity";
import { Home } from "./Home";
import { BrowserRouter } from "react-router-dom";
import { NavigationWithRoute } from "./GitStatsNavigation";

class App extends Component<{}, {}> {
  public render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavigationWithRoute />
          <Route exact path="/" component={Home} />
          <Route path="/complexity" component={Complexity} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
