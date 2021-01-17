import { useEffect } from 'react';
import client from '../../API/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ISendFn = (data: any) => void;

const useWebsocketServer = (path: string, fn?: ISendFn) : ISendFn => {
  useEffect(() => {
    if (!fn) {
      return () => null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMessage = (serverPath: string, data: any) => {
      if (serverPath === path) {
        fn(data);
      }
    };

    client.on('message', onMessage);

    return () : void => {
      client.off('message', onMessage);
    };
  }, [path, fn]);

  return (data: Record<string, unknown>) => {
    client.send(path, data);
  };
};

export default useWebsocketServer;
