// State interface and types
import cytoscape from 'cytoscape';
import { MeiosisCell } from 'meiosis-setup/types';
import { renderGraph } from './cyto';

// Define the layout types for the state
export const layoutTypes = [
  'grid',
  'circle',
  'breadthfirst',
  'concentric',
  'random',
  'cose',
  'cola',
  'klay',
  'dagre',
  'euler',
  'avsdf',
  'cose-bilkent',
  'spread',
];

// Define the import types for the state
export const importTypes = ['inventory', 'recipe', 'entity'];

// Define the import types for the state
export const messageLevel = ['info', 'warning', 'error', 'success'];

// Get the list of graphs from the database
export const defaultGraphOptions = ['Select Graph'];

// Define the app state interface
export interface State {
  cytoCont?: any;
  cyto?: cytoscape.Core;
  graphData?: Object;
  importDataType?: (typeof importTypes)[number];
  layout?: (typeof layoutTypes)[number];
  graphOptions?: typeof defaultGraphOptions;
  graphSelected?: (typeof defaultGraphOptions)[number];
  graphName?: string;
  style?: Object;
  message: string;
  messageLevel: (typeof messageLevel)[number];
  showMenu?: boolean;
  showTrays?: boolean;
  showCyGraph?: boolean;
  showDebug?: boolean;
}

export const updateState = <T>(cell: MeiosisCell<State>, updates: Partial<T>) => {
  cell.update(() => {
    return {
      ...cell.getState(),
      ...updates,
    };
  });
};
