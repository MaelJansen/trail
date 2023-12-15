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
        token: localStorage.getItem('token'),
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

      // I wanna go to the new race page
      window.location.href = `/race/${response.data.id}`;

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
      trigger={<Button icon='plus' color='green' content='Course'></Button>}
    >
      <Modal.Header>Créer une nouvelle course</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Nom</label>
            <input placeholder='Nom' type='text' name='name' />
          </Form.Field>
          <Form.Field>
            <label>Adresse</label>
            <input placeholder='Adresse' type='text' name='address' />
          </Form.Field>
          <Form.Field>
            <label>Distance(km)</label>
            <input placeholder='Distance' type='text' name='distance' />
          </Form.Field>
          <Form.Field>
            <label>Dénivelé positif(m)</label>
            <input placeholder='Dénivelé positif' type='text' name='positiveHeightDifference' />
          </Form.Field>
          <Form.Field>
            <label>Dénivelé négatif(m)</label>
            <input placeholder='Dénivelé négatif' type='text' name='negativeHeightDifference' />
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