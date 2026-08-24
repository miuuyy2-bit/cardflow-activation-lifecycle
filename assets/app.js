import { lifecycleStates } from "./lifecycle-data.js";
import { mountLifecycleExplorer } from "./lifecycle-explorer.js";

const explorer = document.querySelector("[data-state-explorer]");
mountLifecycleExplorer(explorer, lifecycleStates);
