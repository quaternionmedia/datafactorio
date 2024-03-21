// State interface and types
import { Core } from 'cytoscape'
// NOTE: 'Cytoscape' is the library, 'Core' is the needed type
// import { Cytoscape } from 'cytoscape'

export const layoutTypes = [
  'grid', 'circle', 'breadthfirst', 'concentric', 'random',
  'cose', 'cola', 'klay', 'dagre', 'euler', 'avsdf', 'cose-bilkent', 'spread'
]

export const importTypes = ['inventory', 'recipe', 'entity']

export interface State {
    cy?: Core
    graphData?: Object
    importDataType?: typeof importTypes[number]
    layout?: typeof layoutTypes[number]
    inputFile?: string
    style?: Object
    showMenu?: boolean
    showTrays?: boolean
    showCyGraph?: boolean
    showDebug?: boolean
    saveGraph?: boolean
    loadGraph?: boolean
}
