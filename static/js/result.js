var app = {}; // MathLichessHome - scope

app.vm = (function() {
	var vm = {}
	vm.init = function() {
  	vm.email = m.prop("");
  	vm.sms = m.prop(""); 
  	vm.username =  m.prop(""); 

    vm.computeResult = function() {

    if (vm.username())
    {
       window.location = '/'+vm.username().trim()+'/'+variation.toLowerCase();
    }
  }

};
return vm
}())


app.controller = function() {
    app.vm.init();
}

app.view = function(ctrl) {

	return[
	m('nav',[
		m('div.container',[
			m('a[href="/"]',[
				m('h1.logo','ACTUAL AND PROJECTED',m('b',' ELO'))
				])
			])
		]),
	m('div.content-wrapper',[
		m('main',[
			m('div.row',[
				m('div.card',[
					m('div.card__tag-wrapper',[
						m('span.tag.card__tag','3D PROJECTION BY GAMES'),
						m('div.card__plot#chart3dbyGames'),
						m('br'),m('br'),m('br'),m('br'),m('br'),
						m('p.card__description_chart#hover_info','')					
						
					]),
				]),
				m('div.card',[
					m('div.card__tag-wrapper',[
						m('span.tag.card__tag','LEARNING RATE BY HOURS'),
						m('div.card__plot#histogram'),
						m('br'),m('br'),m('br'),m('br'),m('br'),
						m('p.card__description_chart','Your learning rate '+data['gwrhavg'].toFixed(5)+' is better than '+ String( data['densityfunctionhours'] * 100 ) + '%')	
					]),
				])
			]),
			m('div.row',[
				m('div.card',[
					m('div.card__tag-wrapper',[
						m('span.tag.card__tag','WIN PROBABILITY'),
						m('div.card__plot#winProbability'),
						m('br'),m('br'),m('br'),m('br'),m('br'),
						m('p.card__description_chart#hover_winprob','')				
						
					]),
				]),
			]),
		]),
		m('aside',[
			m('div.hot-list',[
				m('h2.hot-list__header','USER OVERVIEW'),
		    	m('img.list-post__img[src="/static/img/join.png"]'),
        
				m('h3.card__title', username['name']),
				m('h3.card__subtitle','Variation | ' + variation),
				m('h3.card__subtitle','Elo    ' , String(data['elo']) + " | Hours " + String(parseInt(data['hours']))),			
				m('h3.card__subtitle',"Games " + String(parseInt(data['games']))),			
				m('br'),
			])
		])
	])


	];
}

m.mount(document.body, {controller:app.controller ,view: app.view});

  