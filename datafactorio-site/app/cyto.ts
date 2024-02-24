import m from "mithril";

import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import cola from "cytoscape-cola";
import klay from "cytoscape-klay";
import euler from "cytoscape-euler";
import coseBilkent from "cytoscape-cose-bilkent";
import avsdf from "cytoscape-avsdf";
import spread from "cytoscape-spread";

cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(klay);
cytoscape.use(euler);
cytoscape.use(coseBilkent);
cytoscape.use(avsdf);
cytoscape.use(spread);

export const renderGraph = (cell) => {
  if (document.getElementById("cy") && cell.getState().graphData) {
    cell.update({ cy: CyContainer(cell) });
  }
}

export const CyContainer = (cell) =>
  m("div#cy", {
    oncreate: (vnode) => {
      cytoscape({
        container: document.getElementById("cy"),
        elements: cell.getState().graphData,
        layout: { name: cell.getState().layout },
        style: cell.getState().style,
      });
    },
  });
