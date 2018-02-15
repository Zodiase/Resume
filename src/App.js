import React, { Component } from 'react';
import classNames from '@xch/class-names';
import injectSheet from 'react-jss';

import logo from './logo.svg';
import './App.css';

import Document from './Document';
import Page from './Page';

const appStyles = {
  document: {
    padding: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    '& > $page': {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '2em',
      marginBottom: '2em',
      boxShadow: `rgba(0, 0, 0, 0.19) 0px ${10/16}em ${30/16}em, rgba(0, 0, 0, 0.23) 0px ${6/16}em ${10/16}em`,
      borderRadius: `${2/16}em`,
    },
  },
  page: {
    boxSizing: 'content-box',
    width: '8.5in',
    height: '11in',
    paddingTop: '0.5in',
    paddingRight: '1in',
    paddingBottom: '0.5in',
    paddingLeft: '1in',
    backgroundColor: 'white',
  }
};

class App extends Component {
  render() {
    return (
      <Document
        className={classNames(
          'App',
          this.props.classes.document,
        )}
        pageClassName={this.props.classes.page}
        header={null}
        footer={(props) => {
          return (
            <div
              style={{
                textAlign: 'right',
              }}
            >{props.pageNumber} / {props.pageCount}</div>
          );
        }}
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

export default injectSheet(appStyles)(App);
