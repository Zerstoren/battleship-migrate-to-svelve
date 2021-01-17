import { useEffect } from 'react';
import client from '../../API';
import useWebsocketServer from '../../shared/hooks/websocketServer';
import { IMainStore } from '../../stores/mainStore';

const useWebsocketAppReconnect = (state: IMainStore) : void => {
  useWebsocketServer('opponentDisconnect', () => {
    state.setError('Disconnected');
  });

  useWebsocketServer('opponentReconnect', () => {
    state.setError('');
  });

  const reconnectAction = useWebsocketServer('reconnect', (data: {error?: string, success?: string}) => {
    if (data.error) {
      state.setError(data.error);
    } else {
      state.setError('');
    }
  });

  useEffect(() => {
    let lastId: string;

    const reconnectFn = () => {
      if (!lastId) {
        lastId = client.id;
        return;
      }

      reconnectAction({
        newId: client.id,
        oldId: lastId,
      });

      lastId = client.id;
    };

    const disconnectFn = () => {
      setTimeout(() => client.connect(), 1000);
      state.setError('Disconnected, try reconnect');
    };

    client.on('disconnect', disconnectFn);
    client.on('connect', reconnectFn);

    return () => {
      client.off('disconnect', disconnectFn);
      client.off('connect', reconnectFn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useWebsocketAppReconnect;
