import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

interface IRepositories {
  url: string;
  name: string;
}

interface IAppState {
  repositories: IRepositories[]
}

class App extends Component<{}, IAppState> {
  private static state = {
    repositories: [],
  }

  public componentDidMount() {
    axios.get('https://api.github.com/users/MancunianSam/repos').
    then(response => console.log(response))
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
         <select>
          {this.state.repositories.map(r => {
            <option id={r.url}>{r.name}</option>
          })}         
           </select> 
        </header>
      </div>
    );
  }
}

export default App;
