import React from 'react';
import KawadaCharacter from './components/KawadaCharacter';
import ProgressCard from './components/ProgressCard';
import LearningStats from './components/LearningStats';

const App = () => {
  return (
    <div className="react-app">
      <div className="row">
        <div className="col-lg-6 mb-4">
          <ProgressCard />
        </div>
        <div className="col-lg-6 mb-4">
          <LearningStats />
        </div>
      </div>
      <KawadaCharacter />
    </div>
  );
};

export default App;
