import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Home from './views/Home';
import About from './views/About';
import Category from './views/Category';
import Room from './views/Room';
import Search from './views/Search';
import SearchResults from './views/SearchResults/SearchResults';

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/Room" render={(props) => <Room {...props} />} />
        <Route exact path="/About">
          <About />
        </Route>
        <Route exact path="/Search">
          <Search />
        </Route>
        <Route
          exact
          path="/Search/:query"
          render={(props) => <SearchResults {...props} />}
        />
        <Route
          exact
          path="/Category/:id"
          render={(props) => <Category {...props} />}
        />
        <Redirect to="/" />
      </Router>
    );
  }
}

export default App;
