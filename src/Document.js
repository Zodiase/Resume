import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from '@xch/class-names';
import injectSheet from 'react-jss';

import Page from './Page';

const documentStyles = {
  root: {
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

class Document extends React.PureComponent {
  render () {
    const {
      classes,
      className,
      children,
    } = this.props;

    const childItems = Array.isArray(children) ? children : (children ? [children] : []);

    return (
      <div
        className={classNames(
          classes.root,
          className,
        )}
      >
        {childItems.map((child, index) => {
          if (child.type !== Page) {
            return child;
          }

          return React.createElement(child.type, {
            ...child.props,
            className: classNames(
                classes.page,
                child.props.className,
            ),
            pageNumber: index,
            key: index,
          });
        })}
      </div>
    );
  }
}

export default injectSheet(documentStyles)(Document);
