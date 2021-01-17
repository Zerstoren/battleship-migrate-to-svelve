import { getSnapshot } from 'mobx-state-tree';
import React, { FC } from 'react';
import { Field, Form } from 'react-final-form';
import useWebsocketServer from '../../shared/hooks/websocketServer';
import { AppHeader } from '../../shared/StyledComponents/Headers';
import LobbyStore from '../../stores/lobby';
import { GameStatus, IProps } from '../App/types';
import { convertFormDataToModel, onValidate } from './helpersFns';
import { BlockSpacing, FloatingInput, FormFloating } from './styledComponents';
import { FormInputData } from './types';

const CreateLobby: FC<IProps> = ({ handleChangeGameStatus } : IProps) => {
  const publishLobby = useWebsocketServer('newLobby');

  const store = LobbyStore.create({
    lobbyName: '',
  });

  const backToMainPage = () => {
    handleChangeGameStatus(GameStatus.MAIN, null);
  };

  const handleSubmit = (values: FormInputData) => {
    const lobbyStore = LobbyStore.create(convertFormDataToModel(values));
    publishLobby(getSnapshot(lobbyStore));
    handleChangeGameStatus(GameStatus.WAIT_CONNECT, lobbyStore);
  };

  return (
    <Form
      initialValues={getSnapshot(store)}
      onSubmit={handleSubmit}
      validate={onValidate}
      render={((props) => (
        <>
          <AppHeader>New Lobby</AppHeader>

          <BlockSpacing>
            <Field name="lobbyName">
              {({ input, meta }) => (
                <FormFloating>
                  <FloatingInput
                    {...input}
                    className={(meta.error && meta.touched && 'is-invalid') as string}
                    type="text"
                    autoFocus
                  />
                  <label>{(meta.error && meta.touched) ? meta.error : 'Lobby Name'}</label>
                </FormFloating>
              )}
            </Field>
          </BlockSpacing>

          <BlockSpacing className="d-flex justify-content-between">
            <Field name="x">
              {({ input, meta }) => (
                <FormFloating>
                  <FloatingInput
                    type="number"
                    className={(meta.error && meta.touched && 'is-invalid') as string}
                    {...input}
                  />
                  <label>{(meta.error && meta.touched) ? meta.error : 'Field size: X'}</label>
                </FormFloating>
              )}
            </Field>
            <Field name="y">
              {({ input, meta }) => (
                <FormFloating>
                  <FloatingInput
                    type="number"
                    className={(meta.error && meta.touched && 'is-invalid') as string}
                    {...input}
                  />
                  <label>{(meta.error && meta.touched) ? meta.error : 'Field size: Y'}</label>
                </FormFloating>
              )}
            </Field>
          </BlockSpacing>

          <BlockSpacing className="d-flex justify-content-between">
            <Field name="ships4n">
              {({ input, meta }) => (
                <FormFloating>
                  <FloatingInput
                    className={(meta.error && 'is-invalid') as string}
                    type="number"
                    {...input}
                  />
                  <label>{(meta.error) ? meta.error : '4x ships count'}</label>
                </FormFloating>
              )}
            </Field>

            <Field name="ships3n">
              {({ input, meta }) => (
                <FormFloating>
                  <FloatingInput className={(meta.error && 'is-invalid') as string} type="number" {...input} />
                  <label>{(meta.error) ? meta.error : '3x ships count'}</label>
                </FormFloating>
              )}
            </Field>
          </BlockSpacing>

          <BlockSpacing className="d-flex justify-content-between">
            <Field name="ships2n">
              {({ input, meta }) => (
                <FormFloating>
                  <FloatingInput className={(meta.error && 'is-invalid') as string} type="number" {...input} />
                  <label>{(meta.error) ? meta.error : '2x ships count'}</label>
                </FormFloating>
              )}
            </Field>

            <Field name="ships1n">
              {({ input, meta }) => (
                <FormFloating>
                  <FloatingInput className={(meta.error && 'is-invalid') as string} type="number" {...input} />
                  <label>{(meta.error) ? meta.error : '1x ships count'}</label>
                </FormFloating>
              )}
            </Field>
          </BlockSpacing>

          <BlockSpacing className="d-flex justify-content-evenly">
            <button className="btn btn-secondary" onClick={backToMainPage}>Back</button>
            <button className="btn btn-primary" onClick={props.handleSubmit}>Create lobby</button>
          </BlockSpacing>
        </>
      ))}
    />
  );
};

export default CreateLobby;
