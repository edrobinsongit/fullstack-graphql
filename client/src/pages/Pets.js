import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const PET_FIELDS_FRAGMENT = gql`
  fragment PetsFields on Pet {
      id
      name
      type
      img
      vaccinated @client
      owner {
        id
        age @client
      }
  }
`;

const GET_PETS = gql`
  query AllPets {
    pets {
      ...PetsFields
    }
  }
  ${PET_FIELDS_FRAGMENT}
`;

const ADD_PET = gql`
  mutation AddPet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      ...PetsFields
    }
  }
  ${PET_FIELDS_FRAGMENT}
`;

export default function Pets() {
  const [modal, setModal] = useState(false)

  const { data, loading, error } = useQuery(GET_PETS)
  const [createPet, newPetStatus] = useMutation(ADD_PET, {
    update(cache, { data: { addPet } }) {
      const data = cache.readQuery({ query: GET_PETS });
      cache.writeQuery({
        query: GET_PETS,
        data: { pets: [addPet, ...data.pets] }
      });
    }
  });

  const onSubmit = input => {
    createPet({
      variables: { newPet: input },
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          __typename: 'Pet',
          id: '' + Date.now(),
          name: input.name,
          type: input.type,
          img: 'https://via.placeholder.com/300',
          vaccinated: true,
          owner: {
            __typename: 'User',
            id: 'owner' + Date.now(),
            name: 'whatever' + Date.now(),
            age: 100
          }
        }
      }

    });
    setModal(false)
  }

  if (loading) {
    return <Loader />
  }

  if (error || newPetStatus.error) {
    return <p>Some error: {error}</p>
  }

  console.log(data.pets[0])

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  )
}
