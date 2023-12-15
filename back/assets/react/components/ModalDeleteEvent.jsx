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

export default function ModalDeleteEvent(props) {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    log: [],
    open: false,
  });
  const { log, open } = state;

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to the API endpoint
      const response = await axios.post('http://localhost:8000/api/event/delete', {
        // Pass the form data as the payload of the request
        id: props.eventId,
      });

      // Handle the response as needed
      console.log(response.data);

      // Close the modal window after successful submission
      dispatch({ event: event.type, name: 'onClick', type: 'CLOSE_MODAL' });

      window.location.href = `/events`;
      
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
      trigger={<Button inverted color='red'><Icon name='close'/>Supprimer</Button>}
    >
      <Modal.Header>Supprimer</Modal.Header>
      <Modal.Content>
        
      </Modal.Content>
      <Modal.Actions>
      <Button
          onClick={(e) =>
            handleDelete(e)
          }
          neutral
        >
          Supprimer
        </Button>

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