import './App.css';
import {Routes, Route} from 'react-router-dom';

import Index from './components/index';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/:id" element={<Index/>}/>
      </Routes>
    </div>
  );
}

export default App;
