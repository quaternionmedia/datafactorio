import m from "mithril";
import meiosisTracer from "meiosis-tracer";
import { meiosisSetup } from "meiosis-setup";
import { MeiosisCell, MeiosisComponent } from "meiosis-setup/types";

import { State } from "./state";
import { layoutTypes, importTypes } from "./state";
import { CyContainer, renderGraph } from "./cyto";
import { FileInput } from "./ingest";

export const SelectOptions = (options, attrs) =>
  m(
    "select",
    { ...attrs },
    options.map((option) =>
      m(
        "option",
        { value: option },
        option.charAt(0).toUpperCase() + option.slice(1)
      )
    )
  );

// Main application component
export const app: MeiosisComponent<State> = {
  initial: {
    cy: null, // Cytoscape instance
    graphData: undefined, // Graph data to be visualized
    importDataType: importTypes[0], // Data type to be imported
    layout: layoutTypes[0], // Layout type to be used
    style: undefined, // Style to be used
    showDebug: true, // Controls visibility of debug 
    showTrays: true, // Controls visibility of trays
    showCyGraph: true, // Controls visibility of the CyGraph component
    //debug: true, // Controls visibility of debug info
  },
  view: (cell: MeiosisCell<State>) => {
    return m("div#header",
      m("h1#title", 
        "Data Factorio"
      ),
      m("div#menu", 
        Buttons(cell), 
        cell.state.showTrays && Trays(cell),
      ),
      cell.state.showCyGraph && CyContainer(cell),
    );
  },
};


export const Buttons = (cell) => {
  const toggleTrays = () => cell.update({ showTrays: !cell.state.showTrays });
  const toggleCyGraph = () => cell.update({ showCyGraph: !cell.state.showCyGraph });
  const toggleDebug = () => handleDebugChange(cell);
  return m("div#menu.buttons",
    m("button.menuitem.toggle",
      { onclick: toggleDebug },
      cell.state.showDebug ? "Hide Debug" : "Show Debug"
    ),
    m("button.menuitem.toggle",
      { onclick: toggleTrays },
      cell.state.showTrays ? "Hide Options" : "Show Options"
    ),
    m("button.menuitem.toggle",
      { onclick: toggleCyGraph },
      cell.state.showCyGraph ? "Hide Graph" : "Show Graph"
    ),
    // m(
    //   "button.menuitem.toggle",
    //   { onclick: toggleCyGraph },
    //   cell.state.saveGraph ? "Save to GraphBase"
    // ),
    // m(
    //   "button.menuitem.toggle",
    //   { onclick: toggleCyGraph },
    //   cell.state.loadGraph ? "Load from GraphBase"
    // )
  );
};

export const Trays = (cell) => {
  return m("div#menu.tray",
    m("div.menuitem.layout", 
      "Layout:",
      SelectOptions(layoutTypes, {
        id: "layoutSelect",
        onchange: (e) => handleLayoutChange(e, cell),
      }),
    ),
    FileInput(cell),
  )
};

export const handleLayoutChange = (e, cell) => {
  const selectedLayout = e.target.value;
  cell.update({ layout: selectedLayout });
  renderGraph(cell);
  
};

export const handleDataTypeChange = (e, cell) => {
  const selectedDataType = e.target.value;
  cell.update({ importDataType: selectedDataType });
};

export const handleDebugChange = (cell) => {
  // Toggle debug state
  cell.update({ showDebug: !cell.getState().showDebug });
  // Hide div with id "tracer" if debug is false
  document.getElementById("tracer").style.display = cell.getState().showDebug ? "block" : "none";
};


// Initialize Meiosis
const cells = meiosisSetup<State>({ app });
cells.map((cell) => {
  m.redraw();
});

m.mount(document.getElementById("app"), {
  view: () => app.view(cells()),
});




// Debug
meiosisTracer({
  selector: "#tracer",
  rows: 20,
  cols: 50,
  streams: [cells],
});
// Make the cells available in the console for debugging
window.cells = cells;