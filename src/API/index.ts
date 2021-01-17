import { connect } from 'socket.io-client';

const client = connect('ws://localhost:8080');

export default client;
