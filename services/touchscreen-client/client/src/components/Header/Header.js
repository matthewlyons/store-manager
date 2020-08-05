import React from 'react';
import { HomeIcon, BackIcon, SearchIcon, LogoIcon } from '../Icons';
import { useHistory } from 'react-router-dom';

export default function Header(props) {
  const history = useHistory();
  function GoBack() {
    history.goBack();
  }
  return (
    <header className="Header ContainerWidth">
      {!props.HideHome && <HomeIcon HomeFunction={props.HomeFunction} />}
      {!props.HideBack && (
        <BackIcon BackFunction={props.BackFunction} BackLocation={GoBack} />
      )}
      <LogoIcon />
    </header>
  );
}
