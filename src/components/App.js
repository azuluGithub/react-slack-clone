import React from 'react';
import { Grid } from 'semantic-ui-react';
import ColorPanel from './colorPanel/ColorPanel';
import SidePanel from './sidePanel/SidePanel';
import Messages from './messages/Messages';
import MetaPanel from './metaPanel/MetaPanel';
import { connect } from 'react-redux';

const App = ({ currentUser }) => {
  return <Grid columns='equal' className="app">
    <ColorPanel />
    <SidePanel currentUser={currentUser}/>

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages />
    </Grid.Column>
      
    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
  </Grid>
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser
  }
}

export default connect(mapStateToProps)(App);
