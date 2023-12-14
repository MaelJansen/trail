import React from 'react';
import { Button, Modal, Form } from 'semantic-ui-react'
import EventListCond from './EventListCond';
import RaceListCond from './RaceListCond';

function exampleReducer(state, action) {
    switch (action.type) {
      case 'CLEAR_LOG':
        return { ...state, log: [] }
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
        }
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
        }
      default:
        throw new Error()
    }
  }
  handleDropdownSelect = selectedValue => {
    // Faire quelque chose avec la valeur sélectionnée dans la classe parente
    console.log('Valeur sélectionnée dans la classe parente :', selectedValue);
  };

export default function ModalNewRace( ) {
    const [state, dispatch] = React.useReducer(exampleReducer, {
        log: [],
        open: false,
      })
      const { log, open } = state

    return(

        <Modal
          onOpen={(e) =>
            dispatch({ event: e.type, name: 'onOpen', type: 'OPEN_MODAL' })
          }
          onClose={(e) =>
            dispatch({ event: e.type, name: 'onClose', type: 'CLOSE_MODAL' })
          }
          open={open}
          trigger={<Button icon='plus' color='white' content='Lien'></Button>}
        >
            <Modal.Header>Associer une course a un évenement :</Modal.Header>
            <Modal.Content>
                <Form>
                  <Form.Group widths='equal'>
                    <EventListCond></EventListCond>
                    <RaceListCond></RaceListCond>
                  </Form.Group>
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
                <Button
                onClick={(e) =>
                    dispatch({
                    event: e.type,
                    name: 'onClick',
                    type: 'CLOSE_MODAL',
                    })
                }
                positive
                >
                Link
                </Button>
            </Modal.Actions>
        </Modal>

    )
}