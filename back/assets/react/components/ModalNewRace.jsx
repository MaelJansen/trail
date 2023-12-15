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

export default function ModalNewRace() {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    log: [],
    open: false,
  });
  const { log, open } = state;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to the API endpoint
      const response = await axios.post('http://localhost:8000/api/race/new', {
        // Pass the form data as the request payload
        name: event.target.name.value,
        address: event.target.address.value,
        distance: event.target.distance.value,
        positiveHeightDifference: event.target.positiveHeightDifference.value,
        negativeHeightDifference: event.target.negativeHeightDifference.value,
      });

      // Handle the response as needed
      console.log(response.data);

      // Close the modal after successful submission
      dispatch({ event: event.type, name: 'onClick', type: 'CLOSE_MODAL' });
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
      trigger={<Button icon='plus' color='green' content='Race'></Button>}
    >
      <Modal.Header>Create a new Race</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input placeholder='Name' type='text' name='name' />
          </Form.Field>
          <Form.Field>
            <label>Address</label>
            <input placeholder='Address' type='text' name='address' />
          </Form.Field>
          <Form.Field>
            <label>Distance(km)</label>
            <input placeholder='Distance' type='text' name='distance' />
          </Form.Field>
          <Form.Field>
            <label>Positive Height Difference(m)</label>
            <input placeholder='Positive Height Difference' type='text' name='positiveHeightDifference' />
          </Form.Field>
          <Form.Field>
            <label>Negative Height Difference(m)</label>
            <input placeholder='Negative Height Difference' type='text' name='negativeHeightDifference' />
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