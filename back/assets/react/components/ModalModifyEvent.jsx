import React from 'react';
import { Button, Modal, Form, Icon } from 'semantic-ui-react';
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

export default function ModalModifyEvent(props) {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    log: [],
    open: false,
  });
  const { log, open } = state;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to the API endpoint
      const response = await axios.post('http://localhost:8000/api/event/edit', {
        // Pass the form data as the payload of the request
        id: props.eventId,
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
      trigger={<Button href='' active inverted color='yellow'><Icon name='cogs'/>Modifier</Button>}
    >
      <Modal.Header>Créer un nouvel événement</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Nom</label>
            <input placeholder={props.eventName} type='text' name='name' />
          </Form.Field>
          <Form.Field>
            <label>Date de début</label>
            <input placeholder={props.eventStartingDate} type='date' name='startDate' />
          </Form.Field>
          <Form.Field>
            <label>Date de fin</label>
            <input placeholder={props.eventEndDate} type='date' name='endDate' />
          </Form.Field>
          <Form.Field>
            <label>Adresse</label>
            <input placeholder={props.eventAddress} type='text' name='address' />
          </Form.Field>
          <Button type='submit' positive>
            Modifier
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
