import React from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';
import axios from 'axios';

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAR_LOG':
      return { ...state, log: [] };
    case 'OPEN_MODAL':
      return {
        log: [
          {
            event: action.event,
            date: new Date().toLocaleTimeString(),
            name: action.name,
            value: true,
          },
          ...state.log,
        ],
        open: true,
      };
    case 'CLOSE_MODAL':
      return {
        log: [
          {
            event: action.event,
            date: new Date().toLocaleTimeString(),
            name: action.name,
            value: true,
          },
          ...state.log,
        ],
        open: false,
      };
    default:
      throw new Error();
  }
}

export default function ModalNewEvent() {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    log: [],
    open: false,
  });
  const { log, open } = state;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to the API endpoint
      const response = await axios.post('http://localhost:8000/api/event/new', {
        // Pass the form data as the request payload
        name: event.target.name.value,
        startDate: event.target.startDate.value,
        endDate: event.target.endDate.value,
        address: event.target.address.value,
      });

      // Handle the response as needed
      console.log(response.data);

      // Close the modal after successful submission
      dispatch({ event: event.type, name: 'onClick', type: 'CLOSE_MODAL' });

      // I wanna go to the new event page
      window.location.href = `/event/${response.data.id}`;
      
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error(error);
    }
  };

  return (
    <Modal
      onOpen={(e) =>
        dispatch({ event: e.type, name: 'onOpen', type: 'OPEN_MODAL' })
      }
      onClose={(e) =>
        dispatch({ event: e.type, name: 'onClose', type: 'CLOSE_MODAL' })
      }
      open={open}
      trigger={<Button icon='plus' color='green' content='Event'></Button>}
    >
      <Modal.Header>Create a new Event</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input placeholder='Name' type='text' name='name' />
          </Form.Field>
          <Form.Field>
            <label>Starting Date</label>
            <input placeholder='Date' type='date' name='startDate' />
          </Form.Field>
          <Form.Field>
            <label>Ending Date</label>
            <input placeholder='Date' type='date' name='endDate' />
          </Form.Field>
          <Form.Field>
            <label>Address</label>
            <input placeholder='Address' type='text' name='address' />
          </Form.Field>
          <Button type='submit' positive>
            Create
          </Button>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={(e) =>
            dispatch({
              event: e.type,
              name: 'onClick',
              type: 'CLOSE_MODAL',
            })
          }
          negative
        >
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
