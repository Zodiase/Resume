import React, { Component } from 'react';
import classNames from '@xch/class-names';

import logo from './logo.svg';
import './App.css';

import Document from './Document';
import Page from './Page';

class App extends Component {
  render() {
    return (
      <Document
        className={classNames(
          'App',
          'foobar',
        )}
      >
        <Page>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
          </div>
        </Page>
        <Page>
          <p>
            Page 2.
          </p>
        </Page>
      </Document>
    );
  }
}

export default App;
