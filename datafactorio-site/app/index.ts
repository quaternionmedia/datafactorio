import m from "mithril";
import meiosisTracer from "meiosis-tracer";
import { meiosisSetup } from "meiosis-setup";
import { MeiosisCell, MeiosisComponent } from "meiosis-setup/types";

// Local Imports
import { State, layoutTypes, importTypes } from "./state";
import { CyContainer, renderGraph } from "./cyto";
import { FileInput } from "./ingest";


// --- Event Handlers ---

// This var ensures a single attachment of the event listener
let isKeyListenerAttached = false;

// Show or hide the Debug Tracer on the backquote key press
export const ToggleGuiKeypressEvent = (cell) => {
  if (!isKeyListenerAttached) {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Backquote') handleDebugChange(cell);
    });
    isKeyListenerAttached = true;
  }
};
// Show or hide the debug tracer
export const handleDebugChange = (cell) => {
  cell.update({ showDebug: !cell.getState().showDebug });
  const tracer = document.getElementById("tracer");
  if (tracer) tracer.style.display = cell.getState().showDebug ? "block" : "none";
};
// Update the layout of the graph
export const handleLayoutChange = (e, cell) => {
  const selectedLayout = e.target.value;
  cell.update({ layout: selectedLayout });
  renderGraph(cell);
};
// Update the import data type
export const handleDataTypeChange = (e, cell) => {
  const selectedDataType = e.target.value;
  cell.update({ importDataType: selectedDataType });
};


// --- UI Components ---
// Button to show or hide the menu
export const ToggleMenuButton = (cell) => {
  const toggleMenu = () => cell.update({ showMenu: !cell.getState().showMenu });
  return m("button.menuToggle", { onclick: toggleMenu },
    cell.getState().showMenu ? m("i.fa.fa-chevron-up") : m("i.fa.fa-chevron-down")
  );
};
// The main menu
export const Menu = (cell) => {
  return m("div#header",
    m("h1#title", "Data Factorio"),
    m("div#subtitle", cell.getState().inputFile),
    m("div#menu", 
      cell.getState().showTrays && MenuTray(cell),
      DevButtons(cell), 
    ),
  );
};
// Developer buttons for debugging and options
export const DevButtons = (cell) => {
  const toggleTrays = () => cell.update({ showTrays: !cell.getState().showTrays });
  const toggleCyGraph = () => cell.update({ showCyGraph: !cell.getState().showCyGraph });
  // Map over the buttons and their respective states
  return m("div#menu.devButtons",
    ["Debug", "Options", "Graph"].map((item, index) => {
      const toggleFunctions = [
        handleDebugChange, 
        toggleTrays, 
        toggleCyGraph
      ];
      const states = [
        cell.getState().showDebug, 
        cell.getState().showTrays, 
        cell.getState().showCyGraph
      ];
      const texts = [
        "Hide Debug", "Show Debug", 
        "Hide Options", "Show Options", 
        "Hide Graph", "Show Graph"
      ];
      return m("button.menuitem.toggle", 
        { onclick: () => toggleFunctions[index](cell) },
        states[index] ? texts[index * 2] : texts[index * 2 + 1]
      );
    })
  );
};
// Select Options for the layout
export const SelectOptions = (options, attrs) => {
  // Check if the value is in the options, if not set it to the first option
  if (options.includes(attrs.value)) {
    attrs.value = attrs.value || options[0];
  } else {
    attrs.value = options[0];
  }
  // Set the select options
  return m("select", { ...attrs },
    options.map(option =>
      m("option", 
        { value: option }, 
        // Ensure the first letter is capitalized
        option.charAt(0).toUpperCase() + option.slice(1))
    )
  );
};
// Menu Tray for the layout and file input
export const MenuTray = (cell) => {
  return m("div#menu.tray",
    m("div.menuitem.layout",
      "Layout: ", 
      SelectOptions(layoutTypes, {
        id: "layoutSelect", 
        value: cell.getState().layout,
        onchange: (e) => handleLayoutChange(e, cell)
      })
    ),
    FileInput(cell)
    // m(
    //   "button.menuitem.toggle", { onclick: toggleCyGraph },
    //   cell.getState().saveGraph ? "Save to GraphBase"
    // ),
    // m(
    //   "button.menuitem.toggle", { onclick: toggleCyGraph },
    //   cell.getState().loadGraph ? "Load from GraphBase"
    // )
  );
};


// --- Main Application Component ---
export const app: MeiosisComponent<State> = {
  initial: {
    cy: null,
    graphData: undefined,
    importDataType: importTypes[0],
    layout: layoutTypes[0],
    style: undefined,
    showMenu: true,
    showDebug: true,
    showTrays: true,
    showCyGraph: true,
  },
  view: (cell: MeiosisCell<State>) => {
    return m("div#app",
      cell.getState().showMenu && Menu(cell),
      ToggleGuiKeypressEvent(cell),
      ToggleMenuButton(cell),
      cell.getState().showCyGraph && CyContainer(cell),
    );
  },
};


// --- Initialization ---
const cells = meiosisSetup<State>({ app });
cells.map((cell) => { m.redraw(); });
m.mount(document.getElementById("app"), { view: () => app.view && app.view(cells()) });


// --- Debug Setup ---
declare global { interface Window { cells: any; } }
meiosisTracer({ selector: "#tracer", rows: 20, cols: 50, streams: [cells] });
window.cells = cells;