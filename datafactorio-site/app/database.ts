import m from "mithril";

// Local Imports
import { defaultGraphOptions, updateState } from "./state";

const baseURL = "http://localhost:8000";

// Other possible API endpoints
// @graphdb.post("/graph/{name}") // Create a new graph
// @graphdb.post("/graph/{name}/node") // Create a new node
// @graphdb.post("/graph/{name}/edge") // Create a new edge
// @graphdb.delete("/graph/{name}/node") // Delete a node
// @graphdb.delete("/graph/{name}/edge") // Delete an edge

// Get the list of graphs from the database
// Only happens when the app is loaded or
// when the user clicks the "Save Graph" button
export const listGraphs = (cell) => {
  m.request({
    method: "GET",
    url: `${baseURL}/graphs`,
  })
    .then((result) => {
      // strip out the "factorio-" prefix
      result = (result as string[]).map((name) => {
        return name.replace("factorio-", "");
      });
      let defaults = defaultGraphOptions;
      let updatedGraphs = defaults.concat(result as string[]);

      // Update the cell state with the list of graphs
      updateState(cell, { graphOptions: updatedGraphs });
    })
    .catch((error) => {
      console.error("DataFactorio:", error);
      const defaultMsg = "Error getting graph list";
      errorMessages(cell, error, defaultMsg);
    });
};

// Save the graph to the database
// Only happens when user clicks Save Graph button
export const saveGraph = (cell) => {
  // Get the graph name and remove the "File: " prefix
  let name = cell.getState().graphName.replace("File: ", "").replace("Database: ", "");

  // Check if graph is loaded
  const graphData = cell.getState().graphData;
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    message(cell, "No graph data loaded", "error");
    return;
  }

  // Convert the graph data to the correct format
  const convertedGraph = {
    nodes: graphData.nodes.map((node) => node.data),
    links: graphData.edges.map((edge) => edge.data),
  };

  // Save the graph to the database
  m.request({
    method: "POST",
    // Add the "factorio-" prefix for the database
    url: `${baseURL}/graph/insert?name=${"factorio-" + name}`,
    body: convertedGraph,
    headers: { "Content-Type": "application/json" },
  })
    .then((result) => {
      // Update the list of graphs, doing manually to cut down time
      let options = cell.getState().graphOptions;
      let updatedGraphs = options.concat(name as string[]);
      updateState(cell, {
        graphName: "Database: " + name,
        graphOptions: updatedGraphs,
        graphSelected: updatedGraphs[updatedGraphs.length - 1],
      });
      message(cell, "Graph saved successfully", "success");
    })
    .catch((error) => {
      console.error("DataFactorio:", error);
      const defaultMsg = "Error saving graph";
      errorMessages(cell, error, defaultMsg);
    });
};

// Load the graph from the database
// Only happens when user changes Graph selection
export const loadGraph = (cell, selectedGraph) =>
  m
    .request({
      method: "GET",
      // Add the "factorio-" prefix for the database
      url: `${baseURL}/graph/${"factorio-" + selectedGraph}`,
    })
    .then(async (response) => {
      // Convert the graph data back to the original format with 'data' objects
      const loadedGraph = await (response as { nodes: any[]; links: any[] });
      const convertedGraph = {
        nodes: loadedGraph.nodes.map((node) => ({ data: node })),
        edges: loadedGraph.links.map((link) => ({ data: link })),
      };
      // Update the cell state with the loaded graph
      updateState(cell, {
        graphName: "Database: " + selectedGraph,
        graphSelected: selectedGraph,
        graphData: convertedGraph,
      });
    })
    .catch((error) => {
      console.error("DataFactorio:", error);
      const defaultMsg = "Error loading graph";
      errorMessages(cell, error, defaultMsg);
    });

// Delete the graph from the database
// Only happens when user clicks Delete Graph button
export const deleteGraph = (cell) => {
  // Check if graph exists
  let name: string = cell.getState().graphName;

  // Remove the "Database: " prefix
  if (name.includes("File: ")) {
    message(cell, "Cannot delete a file graph", "error");
    return;
  }
  name = name.replace("Database: ", "");
  if (!name || name === "" || name === defaultGraphOptions[0]) {
    message(cell, "No graph selected", "error");
    return;
  }

  // Delete the graph from the database
  m.request({
    method: "DELETE",
    // Add the "factorio-" prefix for the database
    url: `${baseURL}/graph/${"factorio-" + name}`,
  })
    .then((result) => {
      listGraphs(cell);
      updateState(cell, { graphName: name, graphSelected: defaultGraphOptions[0] });
      message(cell, "Graph deleted successfully", "success");
    })
    .catch((error) => {
      console.error("DataFactorio:", error);
      const defaultMsg = "Error deleting graph";
      errorMessages(cell, error, defaultMsg);
    });
};

// Handle messages
export function message(cell, message: string, level: string) {
  // Display the message
  updateState(cell, { message: message, messageLevel: level });
  // Wait for 3 seconds and then clear the message
  setTimeout(() => {
    updateState(cell, { message: "", messageLevel: "" });
  }, 3000);
}

// Handle error messages
function errorMessages(cell, error: any, defaultMsg: string = "") {
  // Check for a more specific error message from the server
  let msg = defaultMsg;
  if (
    error.response !== null &&
    error.response !== undefined &&
    error.response["detail"] !== undefined &&
    error.response["detail"] !== ""
  ) {
    msg = error.response["detail"];
  } else if (error.message.includes("recursion")) {
    msg = "";
  }
  message(cell, msg, "error");
}
