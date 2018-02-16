import React from 'react';
import PropTypes from 'prop-types';
import classNames from '@xch/class-names';
import injectSheet from 'react-jss';

import Page from './Page';

import {
  makeArray,
} from './helpers';

const DocumentStyles = {
  root: {
    '&.document': {
      padding: '1px',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',

      '& .document__page': {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '2em',
        marginBottom: '2em',
        boxShadow: `rgba(0, 0, 0, 0.19) 0px ${10/16}em ${30/16}em, rgba(0, 0, 0, 0.23) 0px ${6/16}em ${10/16}em`,
        borderRadius: `${2/16}em`,
      },
    },
  },
};

class Document extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    pageClassName: PropTypes.string,
    header: PropTypes.any,
    footer: PropTypes.any,
    children: PropTypes.any,
  };

  static getInitialPageWithChildren (children) {
    const childrensByPage = [];

    if (children) {
      const childArray = makeArray(children);

      childrensByPage.push(childArray);
    }

    return childrensByPage;
  }

  constructor (props) {
    super(props);

    this.state = {
      isPaginationStable: false,
      // @type {Array<*>}
      childrensByPage: Document.getInitialPageWithChildren(props.children),
    };

    /**
     * Stores references to rendered page components.
     * @type {Array<Page>}
     */
    this._pageRefs = [];
  }

  componentDidMount () {
    this.updatePaginationStable();
  }

  componentWillReceiveProps (nextProps) {
    this.resetPagination(nextProps.children);
  }

  componentDidUpdate () {
    this.updatePaginationStable();
  }

  get childrensByPage () {
    return this.state.childrensByPage;
  }

  updatePaginationStable () {
    if (this.state.isPaginationStable) {
      return;
    }

    const isPaginationStable = this._pageRefs.every((page) => !page.isOverflow);

    this.setState({
      isPaginationStable,
    });
  }

  stablizePage (pageIndex, sizings) {
    // Shallow copy.
    const childrensByPage = [...this.state.childrensByPage];

    const childrenInPage = childrensByPage[pageIndex];
    const childrenInNextPage = childrensByPage[pageIndex + 1] || [];

    // Re-distribute children.
    const [
      newChildrenInPage,
      newChildrenInNextPage,
    ] = childrenInPage.reduce((acc, child, index) => {
      const childSize = sizings.children[index];

      if (
        // Edge case: if a child is larger than the page, it should stay on a page by itself.
        childSize.height >= sizings.container.height && index === 0
      ) {
        acc[0].push(child);
      } else if (
        // Child bottom is inside the page.
        childSize.top <= sizings.container.height &&
        (childSize.top + childSize.height) <= sizings.container.height
      ) {
        acc[0].push(child);
      } else {
        acc[1].push(child);
      }

      return acc;
    }, [[], []]);

    childrensByPage[pageIndex] = newChildrenInPage;
    childrensByPage[pageIndex + 1] = [
      ...newChildrenInNextPage,
      ...childrenInNextPage,
    ];

    const maxStablizeTries = makeArray(this.props.children).length;

    this._stablizePageLoopCount = (this._stablizePageLoopCount || 0) + 1;

    if (this._stablizePageLoopCount > maxStablizeTries) {
      console.error('Pagination has been performed too many times. There might be a bug.', {
        input: {
          pageIndex,
          sizings,
        },
        state: {
          childrensByPage: this.state.childrensByPage,
        },
        next: {
          childrensByPage,
        },
      });
      return;
    }

    this.setState({
      childrensByPage,
    });
  }

  resetPagination (children) {
    this.setState({
      isPaginationStable: false,
      childrensByPage: Document.getInitialPageWithChildren(children),
    });
  }

  render () {
    const {
      className,
      pageClassName,
      header,
      footer,
    } = this.props;

    this._pageRefs = [];

    return (
      <div
        className={classNames(
          'document',
          this.props.classes.root,
          {
            'document--page-unstable': !this.state.isPaginationStable,
          },
          className,
        )}
      >
        {this.childrensByPage.map((children, pageIndex, list) => {
          return (
            <Page
              key={pageIndex}
              className={classNames(
                'document__page',
                pageClassName,
              )}
              documentHeader={header}
              documentFooter={footer}
              pageNumber={pageIndex + 1}
              pageCount={list.length}
              onOverflow={(sizings) => this.stablizePage(pageIndex, sizings)}
              ref={(ref) => this._pageRefs[pageIndex] = ref}
            >{children}</Page>
          );
        })}
      </div>
    );
  }
}

export default injectSheet(DocumentStyles)(Document);
