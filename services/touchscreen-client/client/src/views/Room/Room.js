import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import Header from '../../components/Header';

export default function Room(props) {
  useEffect(() => {
    console.log(props.location.state.categories);
  }, []);
  return (
    <React.Fragment>
      <Header BackLocation='/' />
      <main className='container ContainerWidth IndexGrid' id='MainScreen'>
        {props.location.state.categories.map((category, i) => {
          return (
            <div className='Item' key={i}>
              <Link to={`/Category/${category.title}`}>
                <img
                  className='BackgroundImage'
                  src={
                    process.env.PUBLIC_URL +
                    '/img/CollectionSelect/' +
                    category.image
                  }
                  alt={category.title}
                />
              </Link>
            </div>
          );
        })}
      </main>
    </React.Fragment>
  );
}
