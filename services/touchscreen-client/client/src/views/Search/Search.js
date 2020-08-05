import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import Keyboard from 'react-simple-keyboard';

import Header from '../../components/Header';

export default function Search() {
  const history = useHistory();
  const [input, setInput] = useState('');
  const keyboard = useRef();

  const onChange = (input) => {
    setInput(input);
  };

  const onKeyPress = (button) => {
    if (button === '{enter}') {
      let query = keyboard.current.getInput();
      history.push(`/search/${query}`);
    }
  };

  const newLayout = {
    default: [
      '1 2 3 4 5 6 7 8 9 0 {bksp}',
      'q w e r t y u i o p',
      'a s d f g h j k l {enter}',
      'z x c v b n m',
      '{space}'
    ]
  };

  return (
    <React.Fragment>
      <Header />
      <div className='container ContainerWidth' id='MainScreen'>
        <div className='SearchField'>
          <h1>{input}</h1>
        </div>
        <Keyboard
          keyboardRef={(r) => (keyboard.current = r)}
          layout={newLayout}
          layoutName='default'
          onKeyPress={onKeyPress}
          onChange={onChange}
        />
      </div>
    </React.Fragment>
  );
}
