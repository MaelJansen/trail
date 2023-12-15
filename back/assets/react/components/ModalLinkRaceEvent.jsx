import React from 'react';
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import axios from 'axios';
import { useState, useEffect } from 'react';

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

export default function ModalLinkRaceEvent() {
  const [EventListCond, setEventListCond] = useState([])
  const [eventList, setEventList] = useState([])

  const [RaceListCond, setRaceListCond] = useState([])
  const [raceList, setRaceList] = useState([])

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedRace, setSelectedRace] = useState(null)

  const [state, dispatch] = React.useReducer(exampleReducer, {
    log: [],
    open: false,
  })
  const { log, open } = state


  const handleSubmit = async(e) => {
    e.preventDefault();
    if (selectedEvent && selectedRace) {
       try {
        // Make a POST request to the API endpoint
        const response = await axios.post('http://localhost:8000/api/link', {
          // Pass the form data as the request payload
          event: selectedEvent,
          race: selectedRace,
        });

        console.log(response.data);

        dispatch({ event: 'onClick', name: 'onClick', type: 'CLOSE_MODAL' })
        window.location.reload();

      } catch (error) {

        console.log(error);
      }
    } 
    else {
      console.log('Please fill all the fields')
    }

  }

  useEffect(() => {
    axios.get('http://localhost:8000/api/eventsCond')
      .then(response => {
        if (Array.isArray(response.data)) {
          setEventListCond(response.data)
          console.log(response.data)
          //formatting the data for the dropdown
          const eventList = response.data.map((event) => {
            return {
              key: event.id,
              text: event.Name,
              value: event.id
            }
          })
          setEventList(eventList)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:8000/api/racesCond')
      .then(response => {
        if (Array.isArray(response.data)) {
          setRaceListCond(response.data)
          console.log(response.data)
          //formatting the data for the dropdown
          const raceList = response.data.map((race) => {
            return {
              key: race.id,
              text: race.Name,
              value: race.id
            }
          })
          setRaceList(raceList)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
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
        <Form onSubmit={handleSubmit}>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Event</label>
              {eventList &&
                <Dropdown
                  placeholder='Event'
                  name = 'event'
                  fluid
                  search
                  selection
                  options={eventList}
                  onChange={(e, data) => setSelectedEvent(data.value)}
                />
              }
            </Form.Field>
            <Form.Field>
              <label>Race</label>
              {raceList &&
                <Dropdown
                  placeholder='Race'
                  name = 'race'
                  fluid
                  search
                  selection
                  options={raceList}
                  onChange={(e, data) => setSelectedRace(data.value)}
                />
              }
            </Form.Field>
          </Form.Group>
          <Button color='green' type='submit' postive>Link</Button>
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
  )
}