import { createStore } from 'redux';
import initialState from './store';
import reducer from './reducer';

const store = createStore(reducer, initialState);

export default store;