import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

render(<App />, document.getElementById('app'));

import FastClick from 'fastclick';
FastClick.attach(document.body);
