import React, { Fragment } from 'react';
import LayoutManager from '../reduxconnect/LayoutManagerContainer';
import Appbar from '../reduxconnect/AppBarContainer'

export default model => (
  <Fragment>
    <Appbar/>
    <LayoutManager />
  </Fragment>
)