export function toGraph(input, type) {
    let graph = { nodes: [], edges: [] };

    // Helper function to add a node if it doesn't already exist
    function addNodeIfNotExist(id) {
        if (!graph.nodes.some(node => node.data.id === id)) {
            graph.nodes.push({ data: { id } });
        }
    }

    // Helper function to add an edge
    function addEdge(source, target) {
        if (graph.nodes.some(node => node.data.id === source) && graph.nodes.some(node => node.data.id === target)) {
            graph.edges.push({ data: { source, target } });
        }
    }

    // Modularized handlers for different types
    const typeHandlers = {
        'entity': () => handleEntityType(input),
        'recipe': () => handleRecipeType(input),
        'inventory': () => handleInventoryType(input),
    };

    // Handler for Entity Type
    function handleEntityType(input) {
        addNodeIfNotExist(type);
        for (let key in input) {
            addNodeIfNotExist(key);
            input[key]['ingredients'].forEach(recipe => addEdge(key, recipe));
        }
    }

    // Handler for Inventory Type
    function handleInventoryType(input) {
        addNodeIfNotExist(type);
        for (let key in input) {
            addNodeIfNotExist(key);
        }
    }

    // Handler for recipe type
    function handleRecipeType(input) {
        addNodeIfNotExist(type);
        for (let key in input) {
            addNodeIfNotExist(key);
            console.log(input[key]['ingredients']);
            input[key]['ingredients'].forEach(ingredient => {
                addNodeIfNotExist(ingredient.name);
                addEdge(key, ingredient.name);
            });
        }
    }

    // Execute the appropriate handler based on the type, if it exists
    if (typeHandlers[type]) {
        typeHandlers[type]();
    } else {
        console.error('Unsupported data type');
        return;
    }

    return graph;
}
