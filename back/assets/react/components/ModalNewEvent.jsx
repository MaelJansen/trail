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
        // Pass the form data as the payload of the request
        token: localStorage.getItem('token'),
        name: event.target.name.value,
        startDate: event.target.startDate.value,
        endDate: event.target.endDate.value,
        address: event.target.address.value,
      });

      // Handle the response as needed
      console.log(response.data);

      // Close the modal window after successful submission
      dispatch({ event: event.type, name: 'onClick', type: 'CLOSE_MODAL' });

      // Go to the page of the new event
      window.location.href = `/event/${response.data.id}`;
      
    } catch (error) {
      // Handle errors that occur during the API call
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
      trigger={<Button icon='plus' color='green' content='Événement'></Button>}
    >
      <Modal.Header>Créer un nouvel événement</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Nom</label>
            <input placeholder='Nom' type='text' name='name' />
          </Form.Field>
          <Form.Field>
            <label>Date de début</label>
            <input placeholder='Date' type='date' name='startDate' />
          </Form.Field>
          <Form.Field>
            <label>Date de fin</label>
            <input placeholder='Date' type='date' name='endDate' />
          </Form.Field>
          <Form.Field>
            <label>Adresse</label>
            <input placeholder='Adresse' type='text' name='address' />
          </Form.Field>
          <Button type='submit' positive>
            Créer
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
          Annuler
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
