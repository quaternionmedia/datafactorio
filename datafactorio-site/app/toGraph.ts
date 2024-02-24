import { shapepalette, colorpalette } from "./style";

export function toGraph(input) {
  let graph = { nodes: [], edges: [] };

  const addNodeIfNotExist = (id, attrs = {}) => {
    if (Object.keys(attrs).length !== 0) {
      graph.nodes.push({ data: { id, ...attrs } });
      console.log(attrs);
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
        case "inventory":
          let { width, height, weight } = inputData[key];

          addNodeIfNotExist(key, { width, height, color, shape });
          addEdge(type, key, { color, weight: weight / 100 });
          break;

        case "recipes":
          let product = inputData[key];
          addNodeIfNotExist(key, { color, shape });
          let ingredients = product["ingredients"];
          addEdge(type, key, {
            color,
            weight: Math.sqrt(ingredients.length / 2),
          });
          break;

        case "entities":
          let entity = inputData[key];
          let position = entity["position"];
          addNodeIfNotExist(key, {
            color,
            shape,
            x: position.x,
            y: position.y,
          });
          addEdge(type, key, { color, weight: 0.2 });
          break;

        case "technologies":
          let tech = inputData[key];
          addNodeIfNotExist(key, { color, shape });
          addEdge(type, key, { color, weight: 0.2 });
          break;

        default:
          console.error("Unsupported data type", type);
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
