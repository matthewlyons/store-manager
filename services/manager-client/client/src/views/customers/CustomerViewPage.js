import React, { useEffect, useState, useContext } from 'react';

import { useAlert } from '../../customHooks';

import Moment from 'moment';
import { Link } from 'react-router-dom';

import CustomerForm from '../../components/Modals/CustomerForm';

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Divider,
  Card,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';

import ListLink from '../../components/ListLink';
import ListItem from '../../components/ListItem';
import TableCard from '../../components/TableCard';

import { StoreContext } from '../../context/StoreContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

export default function NewCustomerViewPage(props) {
  const { createAlert } = useAlert();
  const { setSuccess, makeRequest } = useContext(StoreContext);

  const commonCities = [
    'Vancouver',
    'Portland',
    'Ridgefield',
    'Battle Ground',
    'Camas',
    'Washougal'
  ];

  const classes = useStyles();

  const [customerModal, setCustomerModal] = useState(false);

  const [customer, setCustomer] = useState({
    _id: '',
    name: '',
    phone: [],
    addresses: [],
    email: [],
    notes: [],
    orders: [],
    draftorders: []
  });

  useEffect(() => {
    makeRequest('get', 'api', `/customers/${props.match.params.id}`)
      .then((res) => {
        setCustomer(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, []);

  const toggleModal = (modal) => {
    switch (modal) {
      case 'customer':
        setCustomerModal(!customerModal);
        break;
      default:
        break;
    }
  };

  const submitCustomer = (updatedCustomer) => {
    makeRequest(
      'put',
      'api',
      `/customers/${props.match.params.id}`,
      updatedCustomer
    )
      .then((res) => {
        setSuccess('Success');
        setCustomerModal(false);
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">{customer.name}</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              toggleModal('customer');
            }}
          >
            Edit Customer
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Draft Orders */}
        <TableCard
          title={'Draft Orders'}
          delimiter={customer.draftorders.length}
        >
          <ListLink>
            {customer.draftorders.map((order, i) => {
              let products;
              if (order.order) {
                products = order.order.products
                  .map((element) => {
                    return element.title ? element.title : element.sku;
                  })
                  .join(', ');
              }
              return (
                <ListItem key={i} to={`/Orders/View/Draft/${order.order._id}`}>
                  <p>{Moment(order.order.date).format('MM/DD/YYYY')}</p>
                  <p>{products}</p>
                </ListItem>
              );
            })}
          </ListLink>
        </TableCard>

        {/* Orders */}
        <TableCard
          title={'Orders'}
          link={`/Orders/Form/${props.match.params.id}`}
          linkTitle={'Add an Order'}
        >
          {customer.orders.length > 0 && (
            <ListLink>
              {customer.orders.map((order, i) => {
                let products;
                if (order.order) {
                  products = order.order.products
                    .map((element) => {
                      return element.title ? element.title : element.sku;
                    })
                    .join(', ');
                }
                return (
                  <ListItem
                    key={i}
                    to={`/Orders/View/Order/${order.order._id}`}
                  >
                    <p>{Moment(order.order.date).format('MM/DD/YYYY')}</p>
                    <p>{products}</p>
                  </ListItem>
                );
              })}
            </ListLink>
          )}
        </TableCard>

        {/* Phone Numbers */}
        <TableCard
          title={'Phone Numbers'}
          delimiter={customer.phone.length}
          md={6}
        >
          <Table className={classes.table}>
            <TableBody>
              {customer.phone.map((item, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {item.comment}
                  </TableCell>
                  <TableCell align="left">{item.number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>

        {/* Email Addresses */}
        <TableCard
          title={'Email Addresses'}
          delimiter={customer.email.length}
          md={6}
        >
          <Table className={classes.table}>
            <TableBody>
              {customer.email.map((item, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {item}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>

        {/* Addresses */}
        <TableCard
          title={'Addresses'}
          delimiter={customer.addresses.length}
          md={6}
        >
          <Table className={classes.table}>
            <TableBody>
              {customer.addresses.map((item, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {item.comment}
                  </TableCell>
                  <TableCell align="left">
                    {item.street}, {item.city}, {item.state} {item.zip}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>

        {/* Notes */}
        <TableCard title={'Notes'} delimiter={customer.notes.length} md={6}>
          <Table className={classes.table}>
            <TableBody>
              {customer.notes.map((note, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {Moment(note.date).format('MM/DD/YYYY')}
                  </TableCell>
                  <TableCell align="left">{note.comment}</TableCell>
                  <TableCell align="right" className="TableStaffCell">
                    {note.staff}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>
      </Grid>
      {/* Create Customer Modal */}
      <CustomerForm
        customer={customer}
        open={customerModal}
        customerID={props.match.params.id}
        updateCustomer={submitCustomer}
        close={() => {
          toggleModal('customer');
        }}
      />
    </React.Fragment>
  );
}
