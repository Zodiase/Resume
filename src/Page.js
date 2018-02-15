import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from '@xch/class-names';

class Page extends React.PureComponent {
  render () {
    const {
      className,
      children,
    } = this.props;

    return (
      <div
        className={classNames(
          className,
        )}
      >
        {children}
      </div>
    );
  }
}

export default Page;
