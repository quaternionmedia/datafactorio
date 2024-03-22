import m from "mithril";

// Local Imports
import { renderGraph, clearGraph } from "./cyto";
import { style } from "./style";
import { defaultGraphOptions } from "./state";

let baseURL = "http://localhost:8000";


// Save the graph to the database
export const saveGraph = (cell) => {
  // Check if graph exists
  const graphData = cell.getState().graphData;
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    message(cell, "No graph data loaded", "error");
    return;
  }

  // Convert the graph data to the correct format
  const convertedGraph = {
    nodes: graphData.nodes.map(node => node.data),
    links: graphData.edges.map(edge => edge.data)
  };
  
  // Construct the request data
  const name = cell.getState().graphName;
  // Add the "factorio-" prefix for the database
  const url = `${baseURL}/graph/insert?name=${"factorio-" + name}`;

  // Save the graph to the database
  m.request({
    method: "POST",
    url: url,
    body: convertedGraph,
    headers: { "Content-Type": "application/json" }

  }).then(result => {
    console.log("Graph insert result:", result);
    message(cell, "Graph saved successfully", "success");
    listGraphs(cell);
    cell.update({ graphSelected: name });

  }).catch(error => { 
    const defaultMsg = "Error saving graph";
    errorMessages(cell, error, defaultMsg);
  });
};


// Load the graph from the database
export const loadGraph = (cell) => {
  // Check if graph exists or is already loaded
  const name = cell.getState().graphSelected;
  if (!name || name === "" || name === defaultGraphOptions[0]) 
  {
    message(cell, "No graph selected", "error");
    return;
  } else if (name === cell.getState().graphName) {
    message(cell, "Graph already loaded", "error");
    return;
  }

  // Add the "factorio-" prefix for the database
  const url = `${baseURL}/graph/${"factorio-" + name}`;

  // Load the graph from the database
  m.request({
    method: "GET",
    url: url,

  }).then(async (response) => {
    // Convert the graph data back to the original format with 'data' objects
    const loadedGraph = await (response as { nodes: any[], links: any[]});
    console.log("Graph load result:", loadedGraph);
    const convertedGraph = {
      nodes: loadedGraph.nodes.map(node => ({ data: node })),
      edges: loadedGraph.links.map(link => ({ data: link }))
    };
    console.log("Graph converted result:", convertedGraph);

    cell.update({ 
      style: style,
      graphName: name, 
      graphData: convertedGraph 
    });
    renderGraph(cell);

  }).catch((error) => {
    const defaultMsg = "Error loading graph";
    errorMessages(cell, error, defaultMsg);
  });
};


// Get the list of graphs from the database
// Only happens when the app is loaded or 
// when the user clicks the "Save Graph" button
export function listGraphs(cell) {
  const url = `${baseURL}/graphs`;
  m.request({
    method: "GET",
    url: url, 

  }).then(result => {
    let defaults = defaultGraphOptions;
    let updatedGraphs = defaults.concat(result as string[]);
    // Strip out the "factorio-" prefix
    updatedGraphs = updatedGraphs.map((name) => {
      return name.replace("factorio-", "");
    });
    // Update the cell state with the list of graphs 
    cell.update({ graphOptions: updatedGraphs });
    console.log("Graph list:", updatedGraphs);
    return;

  }).catch(error => {
    console.error("Error getting list:", error);
    const defaultMsg = "Error getting graph list";
    errorMessages(cell, error, defaultMsg);
  });
};


// Delete the graph from the database
export const deleteGraph = (cell) => {
  const name = cell.getState().graphName;
  if (!name || name === "" || name === defaultGraphOptions[0]) {
    message(cell, "No graph selected", "error");
    return;
  }
  const url = `${baseURL}/graph/${"factorio-" + name}`;

  // Delete the graph from the database
  m.request({
    method: "DELETE",
    url: url,

  }).then(result => {
    console.log("Graph delete result:", result);
    message(cell, "Graph deleted successfully", "success");
    cell.update({ graphOptions: defaultGraphOptions, graphSelected: defaultGraphOptions[0], graphName: "" });
    clearGraph(cell);
    listGraphs(cell);
  }).catch(error => {
    const defaultMsg = "Error deleting graph";
    errorMessages(cell, error, defaultMsg);
  });
};


// Handle messages
function message(cell, message: string, level: string) {
  cell.update({ message: message, messageLevel: level });
  // Clear the message after a few seconds
  setTimeout(() => {
      cell.update({ message: "", messageLevel: "" });
    }, 
    3500 // 3.5 seconds
  );
}


// Handle error messages
function errorMessages(cell, error: any, defaultMsg: string = "") {
  let msg = defaultMsg;
  // Check for a more specific error message from the server
  if (error.response !== null && 
      error.response !== undefined && 
      error.response["detail"] !== undefined && 
      error.response["detail"] !== "") 
  {
    msg = error.response["detail"];
  } else {
    console.error("Error:", error);
  }
  message(cell, msg, "error");
}

// Other possible API endpoints
// @graphdb.post("/graph/{name}") // Create a new graph
// @graphdb.post("/graph/{name}/node") // Create a new node
// @graphdb.post("/graph/{name}/edge") // Create a new edge
// @graphdb.delete("/graph/{name}/node") // Delete a node
// @graphdb.delete("/graph/{name}/edge") // Delete an edge