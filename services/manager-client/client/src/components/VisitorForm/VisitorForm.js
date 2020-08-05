import React, { useContext, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

import { Button } from '@material-ui/core';

import { StoreContext } from '../../context/StoreContext';

export default function VisitorForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { makeRequest } = useContext(StoreContext);

  useEffect(() => {
    makeRequest('get', 'auth', '/users/')
      .then((res) => {
        setData({ ...data, users: res.data });
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  }, []);

  const [data, setData] = useState({
    users: [
      {
        name: 'Bruce',
        _id: 1
      },
      {
        name: 'Kate',
        _id: 2
      }
    ],

    step: 0,
    employee: { name: undefined, _id: undefined },
    customerAge: undefined,
    customerReturn: undefined,
    room: 0,
    category: undefined,
    priceRange: undefined
  });

  const rooms = [
    {
      title: 'Bedroom',
      categories: ['Beds', 'Chests', 'Dressors', 'Nightstands', 'Benches']
    },
    {
      title: 'Office',
      categories: [
        'Desk',
        'File Cabinets',
        'Hutches',
        'Bookcase',
        'Desk Chairs'
      ]
    },
    {
      title: 'Dining',
      categories: ['Tables', 'Chairs', 'Stools', 'Buffets', 'Wine Cabinets']
    },
    {
      title: 'Living Room',
      categories: [
        'TV Cabinets',
        'TV Wall Units',
        'Occasional',
        'Curio',
        'Clocks'
      ]
    },
    {
      title: 'Misc',
      categories: ['Futon', 'Rocking Chairs', 'Mirrors', 'Kids', 'Outdoor']
    }
  ];

  const ageRanges = ['18-30', '30-50', '50+'];
  const returnOptions = ['Unknown', 'No', 'Yes', 'Repeat Customer'];
  const priceRanges = ['Low', 'Medium', 'High'];

  const handleNext = (key, value) => {
    setData({ ...data, step: data.step + 1, [key]: value });
  };
  const handleBack = () => {
    setData({ ...data, step: data.step - 1 });
  };

  const handleSubmit = () => {
    let visit = {
      user: data.employee._id,
      customerAge: data.customerAge,
      room: rooms[data.room].title,
      category: data.category,
      customerReturn: data.customerReturn
    };
    makeRequest('post', 'api', '/visits', visit)
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return startPage;
      case 1:
        return employeePage;
      case 2:
        return customerPage;
      case 3:
        return returnPage;
      case 4:
        return roomPage;
      case 5:
        return categoryPage;
      case 6:
        return pricePage;
      case 7:
        return submitPage;
      default:
        return 'Error, Something went wrong';
    }
  };

  const startPage = (
    <div className="visitForm">
      <h3>Add a Customer Visit</h3>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleNext();
          }}
        >
          Start
        </Button>
      </div>
    </div>
  );

  const employeePage = (
    <div className="visitForm">
      <h3>Select Your Name</h3>
      <div className="formContainer">
        {data.users.map((item, i) => (
          <Button
            key={i}
            variant="contained"
            onClick={() => {
              handleNext('employee', { name: item.name, _id: item._id });
            }}
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
  const customerPage = (
    <div className="visitForm">
      <h3>Select Customer Age</h3>
      <div className="formContainer">
        {ageRanges.map((item, i) => (
          <Button
            key={i}
            variant="contained"
            onClick={() => {
              handleNext('customerAge', item);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );

  const returnPage = (
    <div className="visitForm">
      <h3>Yes Customer Been In Before?</h3>
      <div className="formContainer">
        {returnOptions.map((item, i) => (
          <Button
            key={i}
            variant="contained"
            onClick={() => {
              handleNext('customerReturn', item);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );

  const roomPage = (
    <div className="visitForm">
      <h3>Select Room</h3>
      <div className="formContainer">
        {rooms.map((item, i) => (
          <Button
            key={i}
            variant="contained"
            onClick={() => {
              handleNext('room', i);
            }}
          >
            {item.title}
          </Button>
        ))}
      </div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
  const categoryPage = (
    <div className="visitForm">
      <h3>Select Category</h3>
      <div className="formContainer">
        {rooms[data.room].categories.map((item, i) => (
          <Button
            key={i}
            variant="contained"
            onClick={() => {
              handleNext('category', item);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
  const pricePage = (
    <div className="visitForm">
      <h3>Select Price Range</h3>
      <div className="formContainer">
        {priceRanges.map((item, i) => (
          <Button
            key={i}
            variant="contained"
            onClick={() => {
              handleNext('priceRange', item);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );

  const submitPage = (
    <div className="visitForm">
      <h3>Is this correct?</h3>
      <div>
        <h4>Employee: {data.employee.name}</h4>
        <h4>Age: {data.customerAge}</h4>
        <h4>Been in before? {data.customerReturn}</h4>
        <h4>
          {rooms[data.room].title} | {data.category} | Price: {data.priceRange}
        </h4>
      </div>
      <div className="formContainer">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );

  return <div className="FullHeight">{getStepContent(data.step)}</div>;
}
