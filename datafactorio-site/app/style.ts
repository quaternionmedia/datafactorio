

export function styleGraph(cy) {
    cy.style()
    .selector('core')
      .style({
        'active-bg-color': '#fff',
      })
      .selector('node')
      .style({
        'background-color': '#787',
        'label': 'data(id)',
        'font-size': '10px',
        'min-zoomed-font-size': '8px',
        'opacity': '0.7',
        'width': 42,
        'height': 42,
      })
      .selector('edge')
        .style({
          'width': 1,
          'line-color': '#777',
          'opacity': '0.7',
        })
      .selector(':selected')
        .style({
          'background-color': 'black',
          'line-color': 'black',
          'opacity': '1',
        })
      .update();
  }