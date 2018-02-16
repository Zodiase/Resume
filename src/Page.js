import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from '@xch/class-names';
import injectSheet from 'react-jss';

import {
  makeArray,
} from './helpers';

const PageStyles = (theme) => ({
  root: {
    '&.page': {
      boxSizing: 'border-box',
      backgroundColor: 'white',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',

      '& .page__header': {
        flex: '0 0 auto',
      },
      '& .page__body': {
        flex: '1 1 0',
        overflow: 'hidden',
      },
      '& .page__footer': {
        flex: '0 0 auto',
      },
      '&.page--overflow': {
        '& .page__body': {
          '@media screen': {
            boxShadow: `inset rgba(0, 0, 0, 0.16) 0px -${10/16}em ${10/16}em -${10/16}em, inset rgba(0, 0, 0, 0.23) 0px -${10/16}em ${10/16}em -${10/16}em`,
          },
        },
      },
    },
  },
});

class Page extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    pageNumber: PropTypes.number,
    pageCount: PropTypes.number,
    documentHeader: PropTypes.any,
    documentFooter: PropTypes.any,
    header: PropTypes.any,
    footer: PropTypes.any,
    children: PropTypes.any,
    onOverflow: PropTypes.func,
  };

  constructor (props) {
    super(props);

    this.state = {
      isOverflow: false,
    };

    /**
     * Since state values are delayed, let's have this cache to represent the most accurate value.
     * The rendering functions should still refer to the value in state.
     * @type {boolean}
     */
    this._isOverflow = false;

    // @type {Array<HTMLElement>}
    this._bodyContainerElement = null;
    /**
     * Stores references to rendered children.
     * @type {Array<HTMLElement>}
     */
    this._childElementRefs = [];
  }

  componentDidMount () {
    this.updateOverflowState();
  }

  componentDidUpdate () {
    this.updateOverflowState();
  }

  get isOverflow () {
    return this._isOverflow;
  }

  set isOverflow (value) {
    this._isOverflow = value;
    this.setState({
      isOverflow: value,
    });
  }

  get contentHeight () {
    return this._bodyContainerElement ? this._bodyContainerElement.scrollHeight : 0;
  }

  get bodyContainerHeight () {
    return this._bodyContainerElement ? this._bodyContainerElement.clientHeight : 0;
  }

  get bodyContainerWidth () {
    return this._bodyContainerElement ? this._bodyContainerElement.clientWidth : 0;
  }

  getPageAndChildrenSizings () {
    if (!this._bodyContainerElement || this._childElementRefs.some((v) => !v)) {
      return null;
    }

    return {
      container: {
        height: this.bodyContainerHeight,
        width: this.bodyContainerWidth,
      },
      children: this._childElementRefs.map((childElement) => {
        return {
          top: childElement.offsetTop - this._bodyContainerElement.offsetTop,
          left: childElement.offsetLeft - this._bodyContainerElement.offsetLeft,
          height: childElement.offsetHeight,
          width: childElement.offsetWidth,
        };
      }),
    };
  }

  updateOverflowState () {
    if (!this._bodyContainerElement) {
      return;
    }

    const isOverflow = this.contentHeight > this.bodyContainerHeight;

    if (this.isOverflow !== isOverflow) {
      this.isOverflow = isOverflow;
    }

    if (isOverflow && this.props.onOverflow) {
      // Collection detailed sizing data.
      const sizings = this.getPageAndChildrenSizings();

      if (sizings) {
        this.props.onOverflow(sizings);
      }
    }
  }

  attachSpyOnChildren (children) {
    if (!children) {
      return children;
    }

    const childArray = makeArray(children);

    this._childElementRefs = [];

    return childArray.map((child, index) => {
      return React.cloneElement(
        child,
        {
          key: index,
          //! Could `ref` be not a HTMLElement?
          ref: (ref) => this._childElementRefs[index] = ref,
        },
      );
    });
  }

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

    const childrenWithSpy = this.attachSpyOnChildren(children);

    return (
      <div
        className={classNames(
          'page',
          this.props.classes.root,
          {
            'page--overflow': this.state.isOverflow,
          },
          className,
        )}
      >
        <div
          className="page__header"
        >{headerElement}</div>
        <div
          className="page__body"
          ref={(ref) => this._bodyContainerElement = ref}
        >{childrenWithSpy}</div>
        <div
          className="page__footer"
        >{footerElement}</div>
      </div>
    );
  }
}

export default injectSheet(PageStyles)(Page);
