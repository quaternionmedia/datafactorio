import m from 'mithril';
import meiosisTracer from 'meiosis-tracer';
import { meiosisSetup } from 'meiosis-setup';

import { State } from './state';
import { toGraph } from './toGraph';
import { styleGraph } from './style';
import { layoutTypes } from './state';

// Configuration for layout options
// TODO: Use allowed values from State

// Configuration for import data types
const importDataTypes = ['recipe', 'entity', 'inventory'];

// Helper function to create a select dropdown
function createSelect(id, options, onChange) {
  return m('select', { id, onchange: onChange },
    options.map(option => m('option', { value: option }, option.charAt(0).toUpperCase() + option.slice(1)))
  );
}

// Function to handle layout change
function handleLayoutChange(e) {
  const target = e.target as HTMLSelectElement;
  cyInstance.layout({ name: target.value }).run();
}

// Function to handle data type change
function handleDataTypeChange(e, cell) {
  const target = e.target as HTMLSelectElement;
  cell.update({ importDataType: target.value });
}

export const App = {
  initial: {
    graphData: null,
    importDataType: 'recipe',
  },
  services: [
    // Add services if needed for asynchronous actions, like fetching data
  ],
  view: (cell: { state: State }) => {
    return m('div', [
      m('h1', 'Graph Visualization'),
      m('div#menu', [
        m('div', ['Data Type:', 
        createSelect('dataTypeSelect', importDataTypes, (e) => handleDataTypeChange(e, cell))]),
        m('div', ['File: ', 
        m('input#fileInput', { type: 'file', onchange: (e) => handleFileChange(e, cell) })]),
      ]),
      m('div#menu', m('div', [
        'Sort:', 
        createSelect('layoutSelect', layoutTypes, handleLayoutChange),
        m('button', { onclick: () => renderGraph(cell.state.graphData) }, 'Reset view'),
      ])),
      m('div#cy', { style: { width: '100%', height: '1000px' } }),
    ]);
  },
};


// Handle file input change
function handleFileChange(event: Event, cell: any) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const fileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target === null) return;
      const elements = JSON.parse(e.target.result as string);
      let graphData;
      console.log(cell.state)
      if (cell.state.importDataType) {
        graphData = toGraph(elements, cell.state.importDataType);
      } else {
        console.error('No data type selected');
        return;
      }
      cell.state.graphData = graphData;
      renderGraph(graphData);
    };
    fileReader.readAsText(fileInput.files[0]);
  }
}

// Initialize Meiosis
const cells = meiosisSetup<State>({ app: App });

m.mount(document.getElementById('app'), {
  view: () => App.view(cells()),
});

cells.map(state => {
  m.redraw(); // Trigger Mithril redraw on state change
});

// // Debug
// meiosisTracer({
//   selector: '#tracer',
//   rows: 25,
//   streams: [cells],
// });

window.cells = cells;


import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola';
import klay from 'cytoscape-klay';
import euler from 'cytoscape-euler';
import coseBilkent from 'cytoscape-cose-bilkent';
import avsdf from 'cytoscape-avsdf';
import spread from 'cytoscape-spread';

cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(klay);
cytoscape.use(euler);
cytoscape.use(coseBilkent);
cytoscape.use(avsdf);
cytoscape.use(spread);


let cyInstance = null; // Holds the Cytoscape instance globally

// Adapted renderGraph function to be used within Meiosis pattern context
function renderGraph(graphData) {
  console.log(graphData)
  // Check if the Cytoscape instance already exists
  if (cyInstance) {
    cyInstance.add(graphData);
  } else {
    // No instance, create a new Cytoscape graph
    cyInstance = cytoscape({
      container: document.getElementById('cy'),
      elements: graphData,
    });
    styleGraph(cyInstance);
  }
}