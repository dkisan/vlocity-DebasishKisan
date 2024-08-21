
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreatePoll from '../component/CreatePoll';
import Vote from '../component/Vote';
import Results from '../component/Results';
import Homepage from '../component/Homepage';
import Navbar from '../component/Navbar';
import Login from '../component/Login';
import Signup from '../component/Signup';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<><Navbar /><CreatePoll /></>} />
        <Route path="/:voteid/:title" element={<><Navbar /><Vote /></>} />
        <Route path="/:voteid/results" element={<><Navbar /><Results /></>} />
        <Route path="/" element={<><Navbar /><Homepage /></>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
