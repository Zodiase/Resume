import * as url from 'url';
import React, { Component } from 'react';
import classNames from '@xch/class-names';
import injectSheet from 'react-jss';
import moment from 'moment';
import marked from 'marked';

import logo from './logo.svg';
import './App.css';

import Document from './Document';
import Page from './Page';

const npmManifest = require('./npmManifest.json');
const versionUrl = url.resolve(`${npmManifest.repository}/`, `tree/v${npmManifest.version}`);

const profile = require('./profiles');

const AppStyles = (theme) => ({
  _subtleLink: {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover, &:focus': {
      color: theme.primaryColor,
      textDecoration: 'underline',
    },
  },
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
    '& .profile__name': {
      fontFamily: theme.sansSerifFontFamily,
      fontSize: '2.5em',
      fontWeight: '900',
      marginTop: '0.2em',
      marginBottom: '0.2em',
    },
    '& .profile__site, & .profile__email, & .profile__phone': {
      fontFamily: theme.serifFontFamily,
      color: theme.secondaryInfoColor,
      '& a': {
        extend: '_subtleLink',
      },
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
    fontFamily: theme.sansSerifFontFamily,
  },
  headerBar: {
    backgroundColor: theme.primaryColor,
    height: `${8/16}em`,
    marginBottom: `${8/16}em`,
  },
  footerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: theme.secondaryInfoColor,
    '& a': {
      extend: '_subtleLink',
    },
  },
  contentSectionTitle: {
    color: theme.primaryColor,
  },
  experienceItem: {
    '&.experience': {
      display: 'grid',
      gridTemplateAreas: [[
        '"employer location title"',
        '"timespan timespan timespan"',
        '"duties   duties   duties"',
      ]],
      gridTemplateColumns: 'auto auto 1fr',

      '& .experience__employer': {
        gridArea: 'employer',
      },
      '& .experience__location': {
        gridArea: 'location',
      },
      '& .experience__employer + .experience__location::before': {
        content: '", "',
      },
      '& .experience__title': {
        gridArea: 'title',
      },
      '& .experience__location + .experience__title::before': {
        content: '""',
        display: 'inline-block',
        width: '0.5em',
        height: '0',
        marginLeft: '0.5em',
        marginRight: '0.5em',
        marginBottom: '0.3em',
        borderTop: '0.1em solid',
      },
      '& .experience__timespan': {
        gridArea: 'timespan',
      },
      '& .experience__duties': {
        gridArea: 'duties',
        fontFamily: theme.serifFontFamily,
      },
    },
  },
});

class App extends Component {

  get styleClasses () {
    return this.props.classes;
  }

  documentHeader = (pageProps) => {
    return (
      <div className={this.styleClasses.headerBar}></div>
    );
  };

  documentFooter = (pageProps) => {
    return (
      <div className={this.styleClasses.footerRow}>
        <label id="version"><a href={versionUrl} target="_blank">{npmManifest.name}@{npmManifest.version}</a></label>
        <label
          id="pagenumber"
          className="pagenumber"
        >
          <span className="pagenumber__index">{pageProps.pageNumber}</span>
          <span>&nbsp;/&nbsp;</span>
          <span className="pagenumber__count">{pageProps.pageCount}</span>
        </label>
      </div>
    );
  };

  renderExperienceItem = (expItem, index) => {
    const {
      title,
      employer,
      location,
      startDate,
      endDate,
      duties,
    } = expItem;

    const [
      startDateString,
      endDateString,
    ] = [
      startDate,
      endDate,
    ].map((s) => s ? moment(s).format('MMM YYYY') : '');

    return (
      <div
        key={index}
        className={classNames(
          'experience',
          this.styleClasses.experienceItem,
        )}
      >
        <span className="experience__employer">{employer}</span>
        <span className="experience__location">{location}</span>
        <span className="experience__title">{title}</span>
        <div className="experience__timespan">
          <span className="experience__timespan__start">{startDateString}</span>
          <span>&nbsp;-&nbsp;</span>
          <span className="experience__timespan__end">{endDateString || 'Present'}</span>
        </div>
        <div
          className="experience__duties"
          dangerouslySetInnerHTML={{__html: marked(duties)}}
        />
      </div>
    );
  };

  render() {
    return (
      <Document
        className={classNames(
          'App',
          this.styleClasses.document,
        )}
        pageClassName={this.styleClasses.page}
        header={this.documentHeader}
        footer={this.documentFooter}
      >
        <Page>
          <section id="basic-info">
            <h1 id="profile-name" className="profile__name">
              <span className="profile__firstname">{profile.firstName}&nbsp;</span>
              {profile.middleName && (
                <span className="profile__middlename">{profile.middleName}&nbsp;</span>
              )}
              <span className="profile__lastname">{profile.lastName}</span>
            </h1>
            <div className="profile__site"><a href={profile.site.url} target="_blank">{profile.site.text}</a></div>
            <div className="profile__phone">{profile.phone}</div>
            <div className="profile__email"><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
          </section>

          {profile.experiences && (
            <section
              id="experiences"
              className="content-section"
            >
              <h2
                className={classNames(
                  'content-section__title',
                  this.styleClasses.contentSectionTitle,
                )}
              >Experience</h2>

              {profile.experiences.map(this.renderExperienceItem)}
            </section>
          )}
        </Page>
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
          <p>
            Page 2.
          </p>
        </Page>
      </Document>
    );
  }
}

export default injectSheet(AppStyles)(App);
