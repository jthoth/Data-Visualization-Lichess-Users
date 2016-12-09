var app = {}; // MathLichessHome - scope

app.watchInput = function(ontype, onenter, onescape) {
      return function(e) {
          ontype(e)
          if (e.keyCode == 13) onenter()
          if (e.keyCode == 27) onescape()
      }
  };

app.vm = (function() {
var vm = {}
vm.init = function() {

  vm.username = m.prop("");
  vm.variation = m.prop("");

  vm.computeResult = function() {

    if (vm.username())
    {
       window.location = '/'+vm.username().trim()+'/'+vm.variation().trim();
    }
  }
 
};
return vm
}())


app.controller = function() {
    
    app.vm.init();
    this.variation = m.prop("bullet");
    app.vm.variation =  this.variation;
    this.variations = [ 
                            {name: 'Bullet', id: 'bullet'},
                            {name: 'Blitz', id: 'blitz'},
                            {name: 'Classical', id: 'classical'},
                            {name: 'Crazyhouse', id: 'crazyhouse'}
                      ];

}


app.view = function(ctrl) {

return[
m('nav',[
  m('div.container',[
    m('a[href="/"]',[
      m('h1.logo','MATH ON',m('b',' LICHESS'))
      ])
    ])
  ]),
m('div.content-wrapper',[
  m('main',[
    m('div.row',[
      m('div.card-home',[
        m('div.card__content-wrapper',[
          m('div.help-tip', [

            m('p','This site is for educational purpose , if you do not have a lichess user; you have register in this link ' , 
            [
              m('hr'),
              m('a.link-help[href="https://es.lichess.org/signup"]','https://es.lichess.org/signup'),
            ]),

          ]),

          m('a[href="#"]',
          m('h3.card__title','PROFILE INFO')),
          m('img.card__img[src="/static/img/profile.png"]'),
          m('p.card__description', ''),
          m('select.subscribe-card__field',{ onchange: m.withAttr('value', ctrl.variation)},[
              ctrl.variations.map(function(variation){
                 return m('option', {value:variation.id} , variation.name)
              })
            ]),
          m('label.subscribe-card__label[for="input_pref"]','Variation'),
          m('input.subscribe-card__field#user_name[placeholder="Enter lichess user"]',{ onkeypress: app.watchInput(m.withAttr('value', app.vm.username), app.vm.computeResult), value: app.vm.username()}),
          m('label.subscribe-card__label[for="user_name"]','Username'),
          error != '' ? m('p.subscribe-error',error ) : '' 
          
          ])
        ])
      ])
    ])
  ])

];
}

m.mount(document.body, {controller: app.controller, view: app.view});
