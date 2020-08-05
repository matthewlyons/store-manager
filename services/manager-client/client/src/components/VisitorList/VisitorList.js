/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { useSnackbar } from 'notistack';
import Moment from 'moment';

import ListLink from '../ListLink';
import ListItem from '../ListItem';

import { StoreContext } from '../../context/StoreContext';

export default function VisitorList() {
  const { enqueueSnackbar } = useSnackbar();
  const { makeRequest } = useContext(StoreContext);
  const [visits, setVisits] = useState([]);
  useEffect(() => {
    makeRequest('get', 'api', '/visits/recent/5')
      .then((res) => {
        let visitList = res.data;
        visitList.length = 5;
        setVisits(visitList);
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  }, []);
  return (
    <ListLink>
      {visits.map((row, i) => {
        return (
          <ListItem key={i}>
            <p>{row.user.name}</p>
            <p>
              {row.room} | {row.category}
            </p>
            <p>{Moment(row.date).format('hh:mm A MM/DD/YY')}</p>
          </ListItem>
        );
      })}
    </ListLink>
  );
}
