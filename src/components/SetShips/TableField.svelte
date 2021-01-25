<script lang="ts">
import Table from "../../shared/StyledComponents/Table.svelte";
import type { ILobby } from "../../stores/lobby";
import Matrix from "../../stores/matrix";

type TShipRestore = (n: number) => void;

export let shipRestore: TShipRestore;
export let lobby: ILobby;
export let disabled: boolean;
export let matrix: Matrix;


</script>

<Table lobby={lobby} let:y={y} let:x={x}>
  <td>{x}:{y}</td>
</Table>