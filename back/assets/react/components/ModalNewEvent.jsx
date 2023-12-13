import React from 'react';
import { Button, Modal, Form } from 'semantic-ui-react'

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

export default function ModalNewEvent( ) {
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
          trigger={<Button icon='plus' color='green' content='Event'></Button>}
        >
            <Modal.Header>Create a new Event</Modal.Header>
            <Modal.Content>
            <Form>
                    <Form.Field>
                        <label>Name</label>
                        <input placeholder='Name' type='text'/>
                    </Form.Field>
                    <Form.Field>
                        <label> Starting Date</label>
                        <input placeholder='Date' type='date'/>
                    </Form.Field>
                    <Form.Field>
                        <label>Ending Date</label>
                        <input placeholder='Date' type='date'/>
                    </Form.Field>
                    <Form.Field>
                        <label>Address</label>
                        <input placeholder='Address' type='text'/>
                    </Form.Field>
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
                Create
                </Button>
            </Modal.Actions>
        </Modal>

    )
}
                