import * as url from 'url';
import React, { Fragment, Component } from 'react';
import classNames from '@xch/class-names';
import injectSheet from 'react-jss';
import moment from 'moment';
import marked from 'marked';

import logo from './logo.svg';
import './App.css';

import Document from './Document';

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
    '& .profile__site, & .profile__email, & .profile__phone': {
      fontFamily: theme.serifFontFamily,
      color: theme.secondaryInfoColor,
      '& a': {
        extend: '_subtleLink',
      },
    },
    '& .skill-group': {
      display: 'inline',
    },
    '& .skill-group__items': {
      display: 'inline',
      margin: 0,
      padding: 0,
      '&::before': {
        content: '" ("',
      },
      '&::after': {
        content: '") "',
      },
    },
    '& .skill-group__item': {
      display: 'inline',
      margin: 0,
      listStyle: 'none',
      '&:not(:last-child)::after': {
        content: '", "',
      },
    },
    '& .experience__location': {
      fontSize: '0.7em',
    },
    '& .experience__title': {
      fontSize: '0.8em',
    },
    '& .experience__employer + .experience__location::before': {
      content: '", "',
    },
    '& .experience__location + .experience__title::before': {
      content: '""',
      display: 'inline-block',
      width: '0.5em',
      height: '0',
      marginLeft: '0.3em',
      marginRight: '0.3em',
      marginBottom: '0.26em',
      borderTop: '0',
      borderBottom: '0.15em solid',
    },
    '& .experience__duties': {
      fontFamily: theme.serifFontFamily,
    },
  },
  page: {
    width: '8.5in',
    height: '11in',
    paddingTop: '0.5in',
    paddingRight: '0.5in',
    paddingBottom: '0.5in',
    paddingLeft: '0.5in',
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
  h1: {
    fontFamily: theme.sansSerifFontFamily,
    fontSize: '2.5em',
    fontWeight: '900',
    marginTop: '0.4em',
    marginBottom: '0.3em',
    color: theme.blackColor,
  },
  h2: {
    fontFamily: theme.sansSerifFontFamily,
    fontSize: '1.5em',
    fontWeight: '700',
    marginTop: '0.4em',
    marginBottom: '0.3em',
    color: theme.primaryColor,
  },
  h3: {
    fontFamily: theme.sansSerifFontFamily,
    fontSize: '1.1em',
    fontWeight: '500',
    marginTop: '0.4em',
    marginBottom: '0.3em',
    color: theme.blackColor,
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
      dutyRemarks,
    } = expItem;

    const [
      startDateString,
      endDateString,
    ] = [
      startDate,
      endDate,
    ].map((s) => s ? moment(s).format('MMM YYYY') : '');

    return (
      <Fragment key={index}>
        <h3
          className={classNames(
            'experience__name',
            this.styleClasses.h3
          )}
        >
          <span className="experience__employer">{employer}</span>
          <span className="experience__location">{location}</span>
          <span className="experience__title">{title}</span>
        </h3>

        <div className="experience__timespan">
          <span className="experience__timespan__start">{startDateString}</span>
          <span>&nbsp;-&nbsp;</span>
          <span className="experience__timespan__end">{endDateString || 'Present'}</span>
        </div>

        <div
          className="experience__duties"
          dangerouslySetInnerHTML={{__html: marked(dutyRemarks)}}
        />
      </Fragment>
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
        <section id="basic-info">
          <h1
            id="profile-name"
            className={this.styleClasses.h1}
          >
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

        {profile.skills && (
          <Fragment>
            <h2
              id="skills"
              className={classNames(
                'section__title',
                this.styleClasses.h2,
              )}
            >Skills</h2>

            <h3
              className={classNames(
                'skillset-title',
                this.styleClasses.h3,
              )}
            >Web Development</h3>
            {profile.skills.pick(
              ['Web'],
              {
                excludes: [
                  'Server',
                ],
              },
            ).map(({ name: groupName, skills }) => {
              return (
                <div
                  key={groupName}
                  className="skill-group"
                >
                  <span className="skill-group__name">{groupName}</span>
                  <ul className="skill-group__items">
                    {skills.map(({ name: skillName }) => {
                      return (
                        <li
                          key={skillName}
                          className="skill-group__item"
                        >{skillName}</li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </Fragment>
        )}

        {profile.experiences && (
          <Fragment>
            <h2
              id="experiences"
              className={classNames(
                'section__title',
                this.styleClasses.h2,
              )}
            >Experience</h2>

            {profile.experiences.map(this.renderExperienceItem)}
          </Fragment>
        )}

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
      </Document>
    );
  }
}

export default injectSheet(AppStyles)(App);
