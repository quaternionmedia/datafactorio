import m from 'mithril';
import { MeiosisCell } from 'meiosis-setup/types';

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

// NOTE: Can't call updateState from here
//       causes circular object in cyto JSON.

export const renderGraph = (cell: MeiosisCell<any>) => {
  const cellState = cell.getState();
  if (document.getElementById('cy') && cellState.graphData) {
    // create updated cytoscape object
    const newCy = cytoscape({
      container: document.getElementById('cy'),
      elements: cellState.graphData,
      layout: { name: cellState.layout },
      style: cellState.style,
    });
    // update the cell state
    const newCyCont = CreateCyContainer(newCy);
    cell.update({ cy: newCy, cyCont: newCyCont });
  }
};

export const clearGraph = (cell: MeiosisCell<any>) =>
  cell.update({
    graphData: undefined,
    graphName: '',
    cytoCont: EmptyCyContainer(cell),
  });

export const CyContainer = (cell: MeiosisCell<any>) =>
  m('div#cy', {
    oncreate: (vnode) => {
      cell.state.cyto;
    },
  });

export const CreateCyContainer = (cyto: cytoscape.Core) =>
  m('div#cy', {
    oncreate: (vnode) => {
      cyto;
    },
  });

export const EmptyCyContainer = (cell: MeiosisCell<any>) =>
  m('div#cy', {
    oncreate: (vnode) => {
      const cellState = cell.getState();
      cytoscape({
        container: document.getElementById('cy'),
        elements: { nodes: [], edges: [] },
        layout: { name: cellState.layout },
        style: cellState.style,
      });
    },
  });
