import { useEffect } from 'react';
import client from '../../API/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ISendFn = (data: any) => void;

const useWebsocketOpponent = (path: string, fn?: ISendFn) : ISendFn => {
  useEffect(() => {
    if (!fn) {
      return () => null;
    }

    const onMessage = (pairPath: string, data: {path: string}) => {
      if (pairPath !== 'pairGet') return;
      if (data.path === path) {
        fn(data);
      }
    };

    client.on('message', onMessage);

    return () : void => {
      client.off('message', onMessage);
    };
  }, [path, fn]);

  return (data: Record<string, unknown>) => {
    const dataSend: {path: string} = {
      ...data,
      path,
    };

    client.send('pairSend', dataSend);
  };
};

export default useWebsocketOpponent;
