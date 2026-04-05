import React from 'react';
import { useGame } from '../context/GameContext';
import BarnScene from '../scenes/BarnScene';
import CrossTiesScene from '../scenes/CrossTiesScene';
import CourseSelectScene from '../scenes/CourseSelectScene';
import CourseMemorizeScene from '../scenes/CourseMemorizeScene';
import CourseRideScene from '../scenes/CourseRideScene';
import ResultsScene from '../scenes/ResultsScene';
import CareScene from '../scenes/CareScene';

const UnicornGame: React.FC = () => {
  const { state } = useGame();

  switch (state.scene) {
    case 'barn':
      return <BarnScene />;
    case 'crossTies':
      return <CrossTiesScene />;
    case 'courseSelect':
      return <CourseSelectScene />;
    case 'courseMemorize':
      return <CourseMemorizeScene />;
    case 'courseRide':
      return <CourseRideScene />;
    case 'results':
      return <ResultsScene />;
    case 'care':
      return <CareScene />;
    default:
      return <BarnScene />;
  }
};

export default UnicornGame;
