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
    showTrays: true, // Controls visibility of trays
    showCyGraph: true, // Controls visibility of the CyGraph component
    debug: true, // Controls visibility of debug info
  },
  view: (cell: MeiosisCell<State>) => {
    const toggleTrays = () => cell.update({ showTrays: !cell.state.showTrays });
    const toggleCyGraph = () =>
      cell.update({ showCyGraph: !cell.state.showCyGraph });


    return m("div", [
      m("h1#title", "Data Factorio"),
      m(
        "div#menu",
        [
          m(
            "div#menu",
            m(
              "button.menuitem",
              { onclick: toggleTrays },
              cell.state.showTrays ? "Hide Options" : "Show Options"
            ),
            m(
              "button.menuitem",
              { onclick: toggleCyGraph },
              cell.state.showCyGraph ? "Hide Graph" : "Show Graph"
            )
          ),
        ],
        cell.state.showTrays &&
          m("div#menu", [
            m("div.menuitem", [
              "Layout:",
              SelectOptions(layoutTypes, {
                id: "layoutSelect",
                onchange: (e) => handleLayoutChange(e, cell),
              }),
            ]),
            FileInput(cell),
          ])
      ),
      cell.state.showCyGraph && CyContainer(cell),
      m("input[type=checkbox]", {
        id: "debug",
        checked: cell.state.debug,
        onchange: (e) => handleDebugChange(e, cell),
      }),
      m("label", { for: "debug" }, "Debug")
    ]);
  },
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

export const handleDebugChange = (e, cell) => {
  const debug = e.target.checked;
  // hide div with id "tracer" if debug is false
  document.getElementById("tracer").style.display = debug ? "block" : "none";
  cell.update({ debug: !cell.getState().debug });
};

// Initialize Meiosis
const cells = meiosisSetup<State>({ app });

m.mount(document.getElementById("app"), {
  view: () => app.view(cells()),
});

cells.map((cell) => {
  m.redraw();
});

// // Debug
meiosisTracer({
  selector: "#tracer",
  rows: 25,
  streams: [cells],
});

window.cells = cells;
