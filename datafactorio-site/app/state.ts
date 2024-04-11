// State interface and types
import cytoscape from "cytoscape";
import { MeiosisCell } from "meiosis-setup/types";
import { render } from "./cyto";

// Define the layout types for the state
export const layoutTypes = [
  "grid",
  "circle",
  "breadthfirst",
  "concentric",
  "random",
  "cose",
  "cola",
  "klay",
  "dagre",
  "euler",
  "avsdf",
  "cose-bilkent",
  "spread",
];

// Define the import types for the state
export const importTypes = ["inventory", "recipe", "entity"];

// Define the import types for the state
export const messageLevel = ["info", "warning", "error", "success"];

// Get the list of graphs from the database
export const defaultGraphOptions = ["Select Graph"];

// Define the app state interface
export interface State {
  cyto?: cytoscape.Core;
  graphName?: string;
  graphOptions?: typeof defaultGraphOptions;
  graphSelected?: (typeof defaultGraphOptions)[number];
  importDataType?: (typeof importTypes)[number];
  layout?: (typeof layoutTypes)[number];
  message: string;
  messageLevel: (typeof messageLevel)[number];
  showConfirmDelete?: boolean;
  showCyGraph?: boolean;
  showDebug?: boolean;
  showMenu?: boolean;
  showTrays?: boolean;
  style?: Object;
  graphData?: Object;
}

export const updateState = <T>(cell: MeiosisCell<State>, updates: Partial<T>) => {
  if (cell.update) {
    cell.update(updates);
  }
  if (updates["graphData"] || updates["layout"] || updates["style"]) {
    render(cell, updates);
  }
};
