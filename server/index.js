const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const userPool = [];
const userPair = {};
const lobbys = {};
const disconnectedPool = {};

io.on('connection', (client) => {
  userPool.push(client);
  client.on('disconnect', () => processDisconnect(client));

  client.on('message', (path, data) => {
    if (path === 'newLobby') {
      lobbys[client.id] = data;
      resendLobbyListForAll();
    } 

    if (path === 'unPubLobby') {
      delete lobbys[client.id];
      resendLobbyListForAll();
    } 

    if (path === 'lobbyList') {
      client.send('lobbyList', lobbys);
    }

    if (path === 'connectLobby') {
      connectUsersPair(client, client.id, data);
    }

    if (path === 'pairSend') {
      pairMessage(client, data);
    }

    if (path === 'reconnect') {
      reconnect(client, data);
    }
  });
});

const findClientById = (clientId) => userPool.find((client) => {
  return client.id === clientId;
});

const connectUsersPair = (client, clientId, targetId) => {
  if (!lobbys[targetId]) {
    client.send('opponentDisconnect');
    return;
  }
  const targetClient = findClientById(targetId);

  if (!targetClient) {
    client.send('opponentDisconnect');
    return;
  }

  userPair[clientId] = targetId;
  userPair[targetId] = clientId;
  delete lobbys[targetId];

  client.send('gamePrepare');
  targetClient.send('gamePrepare');
  resendLobbyListForAll();
};

const pairMessage = (client, data) => {
  const targetClient = findClientById(userPair[client.id]);

  if (!targetClient) {
    client.send('opponentDisconnect');
    return;
  }

  targetClient.send('pairGet', data);
};

const processDisconnect = (client) => {
  const connId = client.id;
  if (userPair[connId]) {
    const targetId = userPair[connId];

    if (disconnectedPool[targetId]) {
      clearTimeout(disconnectedPool[targetId]);
      finallDisconnect(connId)();
      delete disconnectedPool[targetId];
    } else {
      disconnectedPool[connId] = setTimeout(finallDisconnect(connId), 2000);
      findClientById(targetId).send('opponentDisconnect');
    }
  }

  userPool.slice(userPool.indexOf(client), 1);

  if (lobbys[connId]) {
    delete lobbys[connId];
    resendLobbyListForAll();
  }
};

const reconnect = (client, data) => {
  const { oldId, newId } = data;
  if (!disconnectedPool[oldId]) {
    client.send('reconnect', {
      error: 'Server clear all data by old identifier'
    });
    return;
  }

  clearTimeout(disconnectedPool[oldId]);
  delete disconnectedPool[oldId];

  if (!userPair[oldId]) {
    client.send('reconnect', {
      error: 'Opponent is disconnect from game'
    });
    return;
  }

  const oppontId = userPair[oldId];
  userPair[newId] = userPair[oldId];
  userPair[oppontId] = newId;

  findClientById(oppontId).send('opponentReconnect');
  client.send('reconnect', {
    success: 'true'
  });
};

const finallDisconnect = (connId) => {
  const targetId = userPair[connId];

  return () => {
    delete disconnectedPool[connId];
    delete userPair[targetId];
    delete userPair[connId];
  };
};

const resendLobbyListForAll = () => {
  userPool.forEach((client) => {
    client.send('lobbyList', lobbys);
  });
}

server.listen(8080);