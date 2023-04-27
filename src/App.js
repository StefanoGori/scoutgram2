import './App.css';
import {Routes, Route} from 'react-router-dom';

import Index from './components/index';
import Account from './components/account';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/:id" element={<Index/>}/>
        <Route path="/account" element={<Account/>}/>
      </Routes>
    </div>
  );
}

export default App;
