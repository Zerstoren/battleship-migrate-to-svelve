import { onDestroy } from 'svelte/internal';
import client from '../../API/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ISendFn = (data: any) => void;

const useWebsocketServer = (path: string, fn?: ISendFn) : ISendFn => {
  if (fn) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMessage = (serverPath: string, data: any) => {
      if (serverPath === path) {
        fn(data);
      }
    };

    client.on('message', onMessage);

    onDestroy(() => client.off('message', onMessage));
  }

  return (data: Record<string, unknown>) => {
    client.send(path, data);
  };
};

export default useWebsocketServer;
