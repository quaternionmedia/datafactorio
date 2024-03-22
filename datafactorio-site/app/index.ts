import m from 'mithril';
import meiosisTracer from 'meiosis-tracer';
import { meiosisSetup } from 'meiosis-setup';
import { MeiosisCell, MeiosisComponent } from 'meiosis-setup/types';

// Local Imports
import {
  State,
  layoutTypes,
  importTypes,
  defaultGraphOptions,
  updateState,
} from './state';
import { style } from './style';
import { CyContainer, renderGraph, clearGraph } from './cyto';
import { FileInput } from './ingest';
import { saveGraph, loadGraph, deleteGraph, listGraphs } from './database';

// --- Debug ---
// Show or hide the debug tracer
export const toggleTracer = (cell) => {
  const tracer = document.getElementById('tracer');
  cell.update({ showDebug: !cell.getState().showDebug });
  if (tracer) tracer.style.display = cell.getState().showDebug ? 'block' : 'none';
};
// This var ensures a single attachment of the event listener
let isKeyListenerAttached = false;
// Show or hide the Debug Tracer on the backquote key press
export const ToggleGuiKeypressEvent = (cell) => {
  if (!isKeyListenerAttached) {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Backquote') toggleTracer(cell);
    });
    isKeyListenerAttached = true;
  }
};
// Developer buttons for debugging and options
export const DevButtons = (cell: MeiosisCell<State>) => {
  return m(
    'div#dev.devButtons',
    m(
      'button',
      { onclick: () => toggleTracer(cell) },
      cell.state.showDebug ? 'Hide Tracer' : 'Show Tracer'
    ),
    m(
      'button',
      { onclick: () => cell.update({ showTrays: !cell.getState().showTrays }) },
      cell.state.showTrays ? 'Hide Options' : 'Show Options'
    ),
    m(
      'button',
      { onclick: () => cell.update({ showCyGraph: !cell.getState().showCyGraph }) },
      cell.state.showCyGraph ? 'Hide Graph' : 'Show Graph'
    )
  );
};

// --- Event Handlers ---
// Select Options for dropdowns
export const SelectOptions = (options, attrs) => {
  // Check if the value is in the options, if not set it to the first option
  if (options.includes(attrs.value)) {
    attrs.value = attrs.value || options[0];
  } else {
    attrs.value = options[0];
  }
  // Set the select options
  return m(
    'select',
    { ...attrs },
    options.map((option) =>
      m(
        'option',
        { value: option },
        // Ensure the first letter is capitalized
        option.charAt(0).toUpperCase() + option.slice(1)
      )
    )
  );
};
// Update the layout of the graph
export const handleLayoutChange = (e, cell) => {
  const selectedLayout = e.target.value;
  cell.update({ layout: selectedLayout });
  renderGraph(cell);
};
// Update the graph selection
export const handleGraphSelectionChange = (e, cell: MeiosisCell<any>) => {
  const selectedGraph = e.target.value;
  updateState(cell, { graphSelected: selectedGraph });
  // Clear the graph if the default option is selected
  if (selectedGraph === defaultGraphOptions[0]) {
    clearGraph(cell);
    return;
  }
  loadGraph(cell);
};
// Update the import data type
export const handleDataTypeChange = (e, cell) => {
  const selectedDataType = e.target.value;
  cell.update({ importDataType: selectedDataType });
};

// --- UI Components ---
// Button to show or hide the menu
export const ToggleMenuButton = (cell) =>
  m(
    'button.menuToggle',
    { onclick: () => cell.update({ showMenu: !cell.getState().showMenu }) },
    cell.state.showMenu ? m('i.fa.fa-chevron-up') : m('i.fa.fa-chevron-down')
  );

// The main menu
export const Menu = (cell) =>
  m(
    'div#header',
    m('h1#title', 'Data Factorio'),
    m('div#currentGraph', cell.state.graphName),
    m('div#message', { class: cell.state.messageLevel }, cell.state.message),
    m('div#menu', cell.state.showTrays && MenuTray(cell), DevButtons(cell))
  );

// Menu Tray for the layout and file input
export const MenuTray = (cell) =>
  m(
    'div#menu.tray',
    m(
      'div#layouts.menuitem',
      'Layout:',
      SelectOptions(layoutTypes, {
        value: cell.state.layout,
        onchange: (e) => handleLayoutChange(e, cell),
      })
    ),
    m(
      'div#graphs.menuitem',
      'Database Graphs:',
      SelectOptions(cell.state.graphOptions, {
        value: cell.state.graphSelected,
        onchange: (e) => handleGraphSelectionChange(e, cell),
      })
    ),
    m('button.menuitem.saveGraph', { onclick: () => saveGraph(cell) }, 'Save Graph'),
    m(
      'button.menuitem.deleteGraph',
      { onclick: () => deleteGraph(cell) },
      'Delete Graph'
    ),
    FileInput(cell)
  );

// --- Main Application Component ---
export const app: MeiosisComponent<State> = {
  initial: {
    cytoCont: undefined,
    cyto: undefined,
    graphData: undefined,
    importDataType: importTypes[0],
    layout: layoutTypes[0],
    graphOptions: defaultGraphOptions,
    graphSelected: defaultGraphOptions[0],
    style: style,
    message: '',
    messageLevel: 'info',
    showMenu: true,
    showDebug: true,
    showTrays: true,
    showCyGraph: true,
  },
  view: (cell: MeiosisCell<State>) => {
    // Attach the keypress event listener once when the component is created/mounted
    if (!isKeyListenerAttached) {
      ToggleGuiKeypressEvent(cell);
    }
    return m(
      'div#view',
      cell.state.showMenu && Menu(cell),
      ToggleMenuButton(cell),
      cell.state.showCyGraph && CyContainer(cell)
    );
  },
};

// --- Initialization ---
const cells = meiosisSetup<State>({ app });
cells.map((cell) => {
  m.redraw();
});
const appElement = document.getElementById('app');
if (appElement) {
  // Mount the app
  m.mount(appElement, { view: () => app.view && app.view(cells()) });
  // Get the list of graphs from the database when the app is loaded
  listGraphs(cells());
  // Init cy div container
  cells().update({ cytoCont: CyContainer(cells()) });
}

// --- Debug Setup ---
// Attach the Meiosis Tracer to the cells and make it global for debugging
meiosisTracer({
  selector: '#tracer',
  rows: 20,
  cols: 50,
  streams: [cells],
});
