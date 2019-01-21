import React, { Component } from "react";
import { Route, Router } from "react-router";
import { PullRequests } from "./PullRequests";
import { Home } from "./Home";
import { BrowserRouter } from "react-router-dom";
import { GitStatsNavigation } from "./GitStatsNavigation";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { Complexity } from "./Complexity";

class App extends Component<{}, {}> {
  public client = new ApolloClient({
    uri: "http://localhost:9000/graphql"
  });

  public render() {
    return (
      <ApolloProvider client={this.client}>
        <BrowserRouter>
          <div className="App">
            <GitStatsNavigation />
            <Route exact path="/" component={Home} />
            <Route path="/complexity" component={Complexity} />
            <Route path="/pullRequests" component={PullRequests} />
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
