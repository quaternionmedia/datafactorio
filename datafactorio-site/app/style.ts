export const shapepalette = {
  'inventory': 'ellipse',
  'recipes': 'roundrectangle',
  'entities': 'triangle',
  'technologies': 'hexagon',
  'default': 'ellipse',
};

export const colorpalette = {
  'inventory': '#555555',
  'recipes': '#aaa07C',
  'entities': '#87BBA2',
  'technologies': '#333fa3 ',
  'default': '#64494f',
};

export const style = [
  {
    selector: 'node',
    style: {
      'color': '#222',
      'label': 'data(id)',
      'text-valign': 'center',
      'font-size': '10px',
      'min-zoomed-font-size': '8px',
      'opacity': '0.7', 
      'shape': 'data(shape)' || 'ellipse',
      'background-color': 'data(color)' || '#7f7',
    },
    ':selected': {
      'background-color': 'black',
      'line-color': 'black',
      'opacity': '1',
    },
}, 
  {
    selector: 'edge',
    style: {
      'line-color': 'data(color)' || '#777',
      'opacity': '0.5',
      'width': 'data(weight)' || '1',
    },
    ':selected': {
      'background-color': 'black',
      'line-color': 'black',
      'opacity': '1',
    },
  }
];