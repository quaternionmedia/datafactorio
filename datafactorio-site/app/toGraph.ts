import { shapepalette, colorpalette } from './style';

export function toGraph(input) {
  // specify the graph data in the form of a JSON object
  interface NodeData {
    id: string; // Or number, depending on ID strategy
    [key: string]: any; // For any other additional attributes
  }

  interface EdgeData {
    source: string; // Or number
    target: string; // Or number
    [key: string]: any; // For any other additional attributes
  }

  interface Graph {
    nodes: Array<{ data: NodeData }>;
    edges: Array<{ data: EdgeData }>;
  }
  let graph: Graph = { nodes: [], edges: [] };

  const addNodeIfNotExist = (id, attrs = {}) => {
    // Check if a node with the given ID already exists
    const nodeExists = graph.nodes.some((node) => node.data.id === id);

    // If the node doesn't exist and attrs is not empty, add the node
    if (!nodeExists && Object.keys(attrs).length !== 0) {
      graph.nodes.push({ data: { id, ...attrs } });
      //console.log(attrs);
    }
  };

  // Helper function to add an edge
  const addEdge = (source, target, attrs = {}) => {
    if (
      graph.nodes.some((node) => node.data.id === source) &&
      graph.nodes.some((node) => node.data.id === target)
    ) {
      graph.edges.push({ data: { source, target, ...attrs } });
    }
  };

  // Process input for each type
  function processInputForType(type, inputData) {
    addNodeIfNotExist(type, {
      color: colorpalette[type],
      shape: shapepalette[type],
    });
    Object.keys(inputData).forEach((key) => {
      const color = colorpalette[type];
      const shape = shapepalette[type];
      addNodeIfNotExist(key, { color, shape });
      switch (type) {
        case 'inventory':
          let { width, height, weight } = inputData[key];

          addNodeIfNotExist(key, { width, height, color, shape });
          addEdge(type, key, { color, weight: weight / 100 });
          break;

        case 'recipes':
          let product = inputData[key];
          addNodeIfNotExist(key, { color, shape });
          let ingredients = product['ingredients'];
          addEdge(type, key, {
            color,
            weight: Math.sqrt(ingredients.length / 2),
          });
          break;

        case 'entities':
          let entity = inputData[key];
          let position = entity['position'];
          addNodeIfNotExist(key, {
            color,
            shape,
            x: position.x,
            y: position.y,
          });
          addEdge(type, key, { color, weight: 0.2 });
          break;

        case 'technologies':
          let tech = inputData[key];
          addNodeIfNotExist(key, { color, shape });
          addEdge(type, key, { color, weight: 0.2 });
          break;

        default:
          console.error('Unsupported data type', type);
          return;
      }
    });
  }

  // Iterate over each type in the input JSON
  Object.keys(input).forEach((type) => {
    processInputForType(type, input[type]);
  });

  return graph;
}
