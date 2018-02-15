import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from '@xch/class-names';
import injectSheet from 'react-jss';

const PageStyles = (theme) => ({
  root: {
    boxSizing: 'content-box',
    backgroundColor: 'white',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flex: '0 0 auto',
  },
  body: {
    flex: '1 1 0',
  },
  footer: {
    flex: '0 0 auto',
  },
});

class Page extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    pageNumber: PropTypes.number,
    pageCount: PropTypes.number,
    documentHeader: PropTypes.any,
    documentFooter: PropTypes.any,
    header: PropTypes.any,
    footer: PropTypes.any,
    children: PropTypes.any,
  };

  render () {
    const {
      className,
      documentHeader,
      documentFooter,
      header,
      footer,
      children,
    } = this.props;

    const [
      headerElement,
      footerElement,
    ] = [
      header || documentHeader,
      footer || documentFooter,
    ].map((component) => {
      if (typeof component === 'function') {
        return component(this.props);
      } else {
        return component;
      }
    });

    return (
      <div
        className={classNames(
          'page',
          this.props.classes.root,
          className,
        )}
      >
        <div
          className={classNames(
            'page__header',
            this.props.classes.header,
          )}
        >{headerElement}</div>
        <div
          className={classNames(
            'page__body',
            this.props.classes.body,
          )}
        >{children}</div>
        <div
          className={classNames(
            'page__footer',
            this.props.classes.footer,
          )}
        >{footerElement}</div>
      </div>
    );
  }
}

export default injectSheet(PageStyles)(Page);
