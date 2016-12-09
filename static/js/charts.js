/* ===================  3D CHAR FOR THE EFFORT ===================== */
G = data.games;

var data_plot = [{
           z: get_data3d(G,data.min,data.gwrgavg),
           type: 'surface',
           showscale: false,
        }];

var layout = {
  title: false,
  showlegend: false,
  autosize: false,
  width: 380,
  height: 370,
  margin: {             // update the left, bottom, right, top margin
     l: 75, b: 50, r: 50, t: 20
   },
   scene: {
    xaxis: {title: '% Games'},
    yaxis: {title: '% Ratios'},
    zaxis: {title: 'Elo'}
  }

};
Plotly.newPlot('chart3dbyGames', data_plot, layout);

var TdPlot = document.getElementById('chart3dbyGames');
var hoverInfo = document.getElementById('hover_info');

TdPlot.on('plotly_hover', function(data){
    var infotext = data.points.map(function(d){
      return "Games "+String(parseInt(G + ((parseInt(d.x) - 50)/100)*G))  + " | Effort "+ d.y + "% "+ " | Elo " + d.z  ;
    });
    hoverInfo.innerHTML = infotext.join('<br/>');
})
 .on('plotly_unhover', function(data){
    hoverInfo.innerHTML = '';
});

/*  HISTOGRAMS OF RATIOS LERNING */

var data_plot = [
  {
    x: data['distributionhours'],
    type: 'histogram',
  marker: {
    color: 'rgba(0,0,255,0.7)',
  },
  }
];
Plotly.newPlot('histogram', data_plot,layout);


winPrb = compute_winProbability(data['elo'])

/* WIN PROBABILITY*/
var trace1 = {
  x: winPrb.x_values, 
  y: winPrb.y_values, 
  fill: 'tozeroy', 
  type: 'scatter',
  mode: 'none'
};

var data = [trace1];
Plotly.newPlot('winProbability', data, layout);

var WPplot = document.getElementById('winProbability');
var hover_winprob = document.getElementById('hover_winprob');

WPplot.on('plotly_hover', function(data){
    var infotext = data.points.map(function(d){
      return "You have " + d.y.toFixed(2) +"% "+"prob of win to openent elo "+d.x;
    });
    hover_winprob.innerHTML = infotext.join('<br/>');
})
 .on('plotly_unhover', function(data){
    hover_winprob.innerHTML = '';
});