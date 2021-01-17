import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './components/App';
import './API';
import Stores from './stores';

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <Provider {...Stores}>
        <App />
      </Provider>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
