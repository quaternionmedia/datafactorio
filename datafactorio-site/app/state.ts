// State interface and types
import { Cytoscape } from 'cytoscape'

export const layoutTypes = [
  'grid', 'circle', 'breadthfirst', 'concentric', 'random',
  'cose', 'cola', 'klay', 'dagre', 'euler', 'avsdf', 'cose-bilkent', 'spread'
]

export const importTypes = ['inventory', 'recipe', 'entity']



export interface State {
    cy?: Cytoscape
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
  