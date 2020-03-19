import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const Spinner = () => {
    return (
        <Dimmer active>
            <Loader size="huge" content="Loading chats...."/>
        </Dimmer>
    )
}

export default Spinner;
