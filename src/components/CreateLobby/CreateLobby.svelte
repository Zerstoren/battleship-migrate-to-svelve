<script lang="ts">
import { getContext } from "svelte";
import createFieldValidator from "../../shared/helpers/validation";
import { requiredValidator,validateFieldSize,validateShipsCount } from "../../shared/helpers/validators";
import useWebsocketServer from "../../shared/hooks/websocketServer";
import Header from "../../shared/StyledComponents/Header.svelte";
import type { IStore } from "../../stores";
import { STORE_CONTEXT } from "../../stores";
import { LobbyStoreCreate } from "../../stores/lobby";
import { GameStatus } from "../App/types";

const mainStore = getContext<IStore>(STORE_CONTEXT).mainStore;
const publishLobby = useWebsocketServer('newLobby');

let formData = {
  name: '',
  x: 10,
  y: 10,
  ships4n: 1,
  ships3n: 2,
  ships2n: 3,
  ships1n: 4,
}

type TFormData = typeof formData; 

const { data: dataName, validate: validateName } = createFieldValidator<string>(requiredValidator<string>());
const { data: dataShips, validate: validateShips } = createFieldValidator<TFormData>(validateShipsCount<TFormData>());
const { data: dataFieldX, validate: validateFieldX } = createFieldValidator<number>(validateFieldSize<number>());
const { data: dataFieldY, validate: validateFieldY } = createFieldValidator<number>(validateFieldSize<number>());

const createLobby = () => {
  console.log(publishLobby);
  publishLobby(formData);

  mainStore.setLobby(
    GameStatus.WAIT_CONNECT, 
    LobbyStoreCreate(formData),
  );
}

const backToMainMenu = () => {
  mainStore.setGameStatus(GameStatus.MAIN);
}

</script>

<form>
  <Header>New Lobby</Header>

  <div class="spacing">
    <div class="form-floating">
      <input 
        autofocus
        bind:value={formData.name} 
        use:validateName={formData.name}
        class:is-invalid={$dataName.touch && !$dataName.valid}
        type="text" 
        class="form-control " 
      />
      <label>Lobby Name</label>
    </div>
  </div>

  <div class="spacing d-flex justify-content-between">
    <div class="form-floating">
      <input 
        bind:value={formData.x} 
        use:validateFieldX={formData.x}
        class:is-invalid={$dataFieldX.touch && !$dataFieldX.valid}
        type="number" 
        class="form-control" 
      />
      <label>Field size: X</label>
    </div>
    
    <div class="form-floating">
      <input 
        bind:value={formData.y} 
        use:validateFieldY={formData.y}
        class:is-invalid={$dataFieldY.touch && !$dataFieldY.valid}
        type="number" 
        class="form-control" 
      />
      <label>Field size: Y</label>
    </div>
  </div>


  <div class="spacing d-flex justify-content-between">
    <div class="form-floating">
      <input 
        bind:value={formData.ships4n} 
        use:validateShips={formData}
        class:is-invalid={!$dataShips.valid}
        type="number" 
        class="form-control"
      />
      <label>{$dataShips.message || "4x ships count"}</label>
    </div>
    
    <div class="form-floating">
      <input 
        bind:value={formData.ships3n} 
        use:validateShips={formData}
        class:is-invalid={!$dataShips.valid}
        type="number" 
        class="form-control"
      />
      <label>{$dataShips.message || "3x ships count"}</label>
    </div>
  </div>


  <div class="spacing d-flex justify-content-between">
    <div class="form-floating">
      <input 
        bind:value={formData.ships2n} 
        use:validateShips={formData}
        class:is-invalid={!$dataShips.valid}
        type="number" 
        class="form-control"
      />
      <label>{$dataShips.message || "2x ships count"}</label>
    </div>
    
    <div class="form-floating">
      <input 
        bind:value={formData.ships1n} 
        use:validateShips={formData}
        class:is-invalid={!$dataShips.valid}
        type="number" 
        class="form-control"
      />
      <label>{$dataShips.message || "1x ships count"}</label>
    </div>
  </div>

  <div class="spacing d-flex justify-content-evenly">
    <button on:click={backToMainMenu} type="button" class="btn btn-secondary">Back</button>
    <button 
      on:click={createLobby}
      disabled={!$dataName.valid || !$dataShips.valid || !$dataFieldX.valid || !$dataFieldY.valid }
      type="button" 
      class="btn btn-primary" 
    >Create lobby</button>
  </div>
</form>

<style>
  .spacing {
    padding: 10px 0;
  }
</style>