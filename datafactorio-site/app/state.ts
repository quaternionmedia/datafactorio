// State interface and types

export const layoutTypes = [
  'random', 'grid', 'circle', 'breadthfirst', 'concentric',
  'cose', 'cola', 'klay', 'dagre', 'euler', 'avsdf', 'cose-bilkent', 'spread'
]



export interface State {
    graphData?: Object // Specify more detailed types as needed
    importDataType?: 'inventory' | 'recipe' | 'entity' | null
    layout?: typeof layoutTypes[number]
    // layout?: 'random' | 'grid' | 'circle' | 'breadthfirst' | 'concentric' | 'cose' | 'cola' | 'klay' | 'dagre' | 'euler' | 'avsdf' | 'cose-bilkent '| 'spread' | 'null'
  }
  