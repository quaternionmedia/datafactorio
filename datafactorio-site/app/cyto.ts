import m from "mithril";

import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import cola from "cytoscape-cola";
import klay from "cytoscape-klay";
import euler from "cytoscape-euler";
import coseBilkent from "cytoscape-cose-bilkent";
import avsdf from "cytoscape-avsdf";
import spread from "cytoscape-spread";
import { defaultGraphOptions, importTypes, layoutTypes } from "./state";
import { style } from "./style";

cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(klay);
cytoscape.use(euler);
cytoscape.use(coseBilkent);
cytoscape.use(avsdf);
cytoscape.use(spread);

// NOTE: Can't call updateState from here
//       causes circular object in cyto JSON.

export const render = <T>(cell, updates: Partial<T>) => {
  if (document.getElementById("cy")) {
    try {
      ReRenderCyContainer(cell.getState());
    } catch (error) {
      ReRenderCyContainer(cell.state);
    }
  }
};

export const InitCyContainer = () =>
  m("div#cy", {
    oncreate: (vnode) => {
      cytoscape({
        container: document.getElementById("cy"),
        elements: { nodes: [], edges: [] },
        layout: { name: "grid" },
      });
    },
  });

export const UpdateCyContainer = (cell) =>
  cytoscape({
    container: document.getElementById("cy"),
    elements: cell.getState().graphData,
    layout: { name: cell.getState().layout },
    style: cell.getState().style,
  });

export const ReRenderCyContainer = (state) =>
  cytoscape({
    container: document.getElementById("cy"),
    elements: state.graphData,
    layout: { name: state.layout },
    style: state.style,
  });

// export const renderGraph = (cell) => {
//   if (document.getElementById("cy") && cell.getState().graphData) {
//     cell.update({ cy: CyContainer(cell) });
//   }
// };

// export const clearGraph = (cell) => {
//   cell.update({
//     graphData: null,
//     cy: cytoscape({
//       container: document.getElementById("cy"),
//       elements: [],
//       layout: { name: cell.getState().layout },
//       style: cell.getState().style,
//     }),
//   });
// };

// export const CyContainer = (cell) =>
//   m("div#cy", {
//     oncreate: (vnode) => {
//       cytoscape({
//         container: document.getElementById("cy"),
//         elements: cell.getState().graphData,
//         layout: { name: cell.getState().layout },
//         style: cell.getState().style,
//       });
//     },
//   });
