import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router';
import './index.scss';



@withRouter @inject('common') @observer
export default class App extends Component {
  whatever = 'shit'

  render() {
    const { common } = this.props;
    return (
      <div onClick={() => common.setWhatever('wazawaza wazaap bitconneeeeect')}>
        Herrow {common.whatever}
      </div>
    );
  }
}