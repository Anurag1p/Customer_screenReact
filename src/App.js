
import './App.css';
import MainScreenWrapper from './components/MainScreenWrapper';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Counter from './components/Counter';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/:id' element={<MainScreenWrapper />} />
          <Route path='/advertisement' element={<Counter />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
