import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from '@xch/class-names';

import Page from './Page';

class Document extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    pageClassName: PropTypes.string,
    header: PropTypes.any,
    footer: PropTypes.any,
    children: PropTypes.any,
  };

  render () {
    const {
      className,
      pageClassName,
      header,
      footer,
      children,
    } = this.props;

    const childItems = Array.isArray(children) ? children : (children ? [children] : []);

    return (
      <div
        className={classNames(
          'document',
          className,
        )}
      >
        {childItems.map((child, index, list) => {
          if (child.type !== Page) {
            return child;
          }

          return React.createElement(child.type, {
            ...child.props,
            className: classNames(
              child.props.className,
              pageClassName,
            ),
            documentHeader: header,
            documentFooter: footer,
            pageNumber: index + 1,
            pageCount: list.length,
            key: index,
          });
        })}
      </div>
    );
  }
}

export default Document;
