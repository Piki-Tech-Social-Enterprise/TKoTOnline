import React from 'react';
import {
  Container
} from 'reactstrap';
import CommunityNetworkLink from '../Sections/CommunityNetworkLink';




const NewsFeedSection = props => {
  const links = [
    
    {
      displayName: 'COVID-19',
      url: '#tkot'
    },
    {
      displayName: 'Tamaki makaurau',
      url: '#tkot'
    },
    {
      displayName: 'Maori Business',
      url: '#tkot'
    },
    {
      displayName: 'Taitokerau',
      url: '#tkot'
    },
    {
      displayName:  'Te Arawa',
      url: '#tkot'
    },
    
 
    {
      displayName:  'B.O.P Tauranga',
      url: '#tkot'
    },
    {
      displayName: 'Tainui Tribe',
      url: '#tkot'
    },
    {
      displayName: 'Te Puni Kokiri',
      url: '#tkot'
    },
    {
      displayName: 'Ngai Tahu',
      url: '#tkot'
    },
    {
      displayName: 'Ngati Raukawa',
      url: '#tkot'
    },
    {
      displayName: 'Ngapuhi',
      url: '#tkot'
    },
    
    
    {
      displayName: 'Ministry of Health',
      url: '#tkot'
    },
 

  ];
  return (
    <Container>
      <CommunityNetworkLink link={links} />
      
    </Container>
  )
}

export default NewsFeedSection
