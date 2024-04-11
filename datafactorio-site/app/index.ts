import m from "mithril";
import meiosisTracer, { MeiosisTracer } from "meiosis-tracer";
import { meiosisSetup } from "meiosis-setup";
import { MeiosisCell, MeiosisComponent } from "meiosis-setup/types";

// Local Imports
import {
  State,
  layoutTypes,
  importTypes,
  defaultGraphOptions,
  updateState,
} from "./state";
import { style } from "./style";
import { InitCyContainer, ReRenderCyContainer } from "./cyto";
import { FileInput } from "./ingest";
import { saveGraph, loadGraph, deleteGraph, listGraphs, message } from "./database";

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
    "select",
    { ...attrs },
    options.map((option) =>
      m(
        "option",
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
  updateState(cell, { layout: selectedLayout });
};
// Update the graph selection
export const handleGraphSelectionChange = (e, cell) => {
  const selectedGraph = e.target.value;
  if (!selectedGraph || selectedGraph === "") {
    message(cell, "No graph selected", "error");
    return;
  }
  if (selectedGraph === document.getElementById("currentGraph")?.textContent) {
    message(cell, "Graph already loaded", "error");
    return;
  }
  // Clear the graph if the default option is selected
  if (selectedGraph === defaultGraphOptions[0]) {
    updateState(cell, {
      graphSelected: defaultGraphOptions[0],
      graphName: "",
      graphData: { nodes: [], edges: [] },
    });
    return;
  }
  loadGraph(cell, selectedGraph);
};
// Update the import data type
export const handleDataTypeChange = (e, cell) => {
  const selectedDataType = e.target.value;
  updateState(cell, { importDataType: selectedDataType });
};
// Show or hide the debug tracer
export const toggleTracer = (cell) => {
  updateState(cell, { showDebug: !cell.getState().showDebug });
  const tracer = document.getElementById("tracer");
  if (tracer) tracer.style.display = cell.getState().showDebug ? "block" : "none";
};
// This var ensures a single attachment of the event listener
let isKeyListenerAttached = false;
// Show or hide the Debug Tracer on the backquote key press
export const ToggleGuiKeypressEvent = (cell) => {
  if (!isKeyListenerAttached) {
    document.addEventListener("keydown", (event) => {
      if (event.code === "Backquote") toggleTracer(cell);
    });
    isKeyListenerAttached = true;
  }
};
// Show the confirm delete popup
export const handleShowConfirmDelete = (cell) => {
  // Only show if the graph is from the database
  if (cell.getState().graphName.startsWith("Database: ")) {
    updateState(cell, { showConfirmDelete: true });
  }
};
// Close the confirm delete popup
export const handleConfirmDelete = (cell) => {
  // Hide the confirmation popup
  updateState(cell, { showConfirmDelete: false });
  deleteGraph(cell);
};

// --- UI Components ---
// Button to show or hide the menu
export const ToggleMenuButton = (cell) =>
  m(
    "button.menuToggle",
    { onclick: () => updateState(cell, { showMenu: !cell.getState().showMenu }) },
    m("img", {
      src: cell.state.showMenu ? "chev-up.png" : "chev-down.png",
      alt: cell.state.showMenu ? "Up" : "Down",
    })
  );

// The main menu
export const Menu = (cell) =>
  m(
    "div#header",
    m("h1#title", "Data Factorio"),
    m(
      "div#messagebox",
      m("div#currentGraph", cell.state.graphName),
      m("div#message", { class: cell.state.messageLevel }, cell.state.message)
    ),
    m("div#menu", cell.state.showTrays && MenuTray(cell), DevButtons(cell))
  );

// Menu Tray for the layout and file input
export const MenuTray = (cell) =>
  m(
    "div#menu.tray",
    m(
      "div#layouts.menuitem",
      "Layout:",
      SelectOptions(layoutTypes, {
        value: cell.state.layout,
        onchange: (e) => handleLayoutChange(e, cell),
      })
    ),
    m(
      "div#graphs.menuitem",
      "Database Graphs:",
      SelectOptions(cell.state.graphOptions, {
        value: cell.state.graphSelected,
        onchange: (e) => handleGraphSelectionChange(e, cell),
      })
    ),
    m(
      "button#saveGraph.menuitem.saveGraph",
      { onclick: () => saveGraph(cell) },
      "Save Graph"
    ),
    m(
      "button#deleteGraph.menuitem.deleteGraph",
      { onclick: () => handleShowConfirmDelete(cell) },
      "Delete Graph"
    ),
    FileInput(cell)
  );

// Show confirm message for deleting a graph
export const ConfirmDeletePopup = (cell) =>
  cell.state.showConfirmDelete
    ? m(
        "div#popup",
        m("div#popupGrid", [
          m("p", "Are you sure you want to delete this graph?"),
          m(
            "button#deleteGraphConfirm.menuitem.deleteGraph",
            { onclick: () => handleConfirmDelete(cell) },
            "Delete"
          ),
          m(
            "button.menuitem",
            { onclick: () => updateState(cell, { showConfirmDelete: false }) },
            "Cancel"
          ),
        ])
      )
    : null;

export const toggleGraph = (cell) => {
  updateState(cell, { showCyGraph: !cell.getState().showCyGraph });
  const cyGraph = document.getElementById("cy");
  if (cyGraph) cyGraph.style.display = cell.getState().showCyGraph ? "block" : "none";
};

// Developer buttons for debugging and options
export const DevButtons = (cell) =>
  m(
    "div#dev.devButtons",
    m(
      "button",
      { onclick: () => toggleTracer(cell) },
      cell.state.showDebug ? "Hide Tracer" : "Show Tracer"
    ),
    m(
      "button",
      { onclick: () => updateState(cell, { showTrays: !cell.getState().showTrays }) },
      cell.state.showTrays ? "Hide Options" : "Show Options"
    ),
    m(
      "button",
      {
        onclick: () => toggleGraph(cell),
      },
      cell.state.showCyGraph ? "Hide Graph" : "Show Graph"
    )
  );

// --- Main Application Component ---
export const app: MeiosisComponent<State> = {
  initial: {
    cyto: undefined,
    graphName: "",
    graphOptions: defaultGraphOptions,
    graphSelected: defaultGraphOptions[0],
    importDataType: importTypes[0],
    layout: layoutTypes[0],
    message: "",
    messageLevel: "info",
    showConfirmDelete: false,
    showCyGraph: true,
    showDebug: true,
    showMenu: true,
    showTrays: true,
    style: style,
    graphData: undefined,
  },
  view: (cell: MeiosisCell<State>) => {
    // Attach the keypress event listener once when the component is created/mounted
    if (!isKeyListenerAttached) {
      ToggleGuiKeypressEvent(cell);
    }
    if (!isTracerListenerAttached) {
      attachTracerEvents(cell);
    }
    return m(
      "div#view",
      cell.state.showMenu && Menu(cell),
      ToggleMenuButton(cell),
      InitCyContainer(),
      ConfirmDeletePopup(cell)
    );
  },
};

// Attach event listeners to Meiosis Tracer buttons
let isTracerListenerAttached = false;
export const attachTracerEvents = (cell) => {
  if (
    document.getElementById("tracerStepBack_0") &&
    document.getElementById("tracerStepForward_0")
  ) {
    // get the previous state and update the graph
    document.getElementById("tracerStepBack_0")?.addEventListener("click", () => {
      handleStepBack(cell.state);
    });
    // get the next state and update the graph
    document.getElementById("tracerStepForward_0")?.addEventListener("click", () => {
      handleStepForward(cell.state);
    });
    isTracerListenerAttached = true;
  }
};

// Rerender the graph when the state changes
export const handleStepChange = (cell: MeiosisCell<State>) => {
  // Check if the graph data has changed before rendering
  console.log(`handleStepChange: ${cell.state.graphName}`);
  // check if the current step is the latest
  if (cell.state === cell.getState()) {
    updateState(cell, { graphData: cell.getState().graphData });
  } else {
    updateState(cell, { graphData: cell.state.graphData });
  }
};
// Rerender the graph when the state changes
export const handleStepBack = (backState: State) => {
  // Check if the graph data has changed before rendering
  console.log(`handleStepForward: ${backState}`);
  console.log(`handleStepForward: ${backState.graphName}`);
};
// Rerender the graph when the state changes
export const handleStepForward = (forwardState: State) => {
  // Check if the graph data has changed before rendering
  console.log(`handleStepForward: ${forwardState}`);
  console.log(`handleStepForward: ${forwardState.graphName}`);
};

// --- Initialization ---
const cells = meiosisSetup<State>({ app });
cells.map((cell) => {
  m.redraw();
});
const appElement = document.getElementById("app");
if (appElement) {
  // Mount the app
  m.mount(appElement, { view: () => app.view && app.view(cells()) });

  // Get the list of graphs from the database when the app is loaded
  listGraphs(cells());

  // Attach the Meiosis Tracer to the cells and make it global for debugging
  meiosisTracer({
    selector: "#tracer",
    rows: 20,
    cols: 50,
    streams: [cells],
  }) as MeiosisTracer;
}

// --- Debug Setup ---
// // Attach the Meiosis Tracer to the cells and make it global for debugging
// const tracer = meiosisTracer({
//   selector: "#tracer",
//   rows: 20,
//   cols: 50,
//   streams: [cells],
// });
