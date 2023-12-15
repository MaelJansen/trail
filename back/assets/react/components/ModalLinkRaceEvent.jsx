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
        // Faire une requête POST vers le point d'API
        const response = await axios.post('http://localhost:8000/api/link', {
          // Passer les données du formulaire en tant que charge utile de la requête
          event: selectedEvent,
          race: selectedRace,
        });

        console.log(response.data);

        dispatch({ event: 'onClick', name: 'onClick', type: 'CLOSE_MODAL' })
        window.location.href = `/event/${selectedEvent}`;

      } catch (error) {

        console.log(error);
      }
    } 
    else {
      console.log('Veuillez remplir tous les champs')
    }

  }

  useEffect(() => {
    axios.get('http://localhost:8000/api/eventsCond')
      .then(response => {
        if (Array.isArray(response.data)) {
          setEventListCond(response.data)
          console.log(response.data)
          // Formatage des données pour le dropdown
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
          // Formatage des données pour le dropdown
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
      trigger={<Button icon='linkify' style={{ backgroundColor: 'white', color: 'black' }} content='Lien'></Button>}
    >
      <Modal.Header>Associer une course à un événement :</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Événement</label>
              {eventList &&
                <Dropdown
                  placeholder='Événement'
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
              <label>Course</label>
              {raceList &&
                <Dropdown
                  placeholder='Course'
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
          <Button color='green' type='submit' postive>Lier</Button>
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
  )
}