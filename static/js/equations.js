/* =====    SOME FUNCTIONS OF MODEL ===== */

function model_learning (MIN,GR,T) {
  
  return parseInt(3000 - (3000  - MIN) * Math.exp(- GR * T ));
}

function get_data3d(ToHours,LwRatio,LearningR)
{
  var Z = [];

  for(i=(ToHours - (ToHours * 0.5 )); i<= (ToHours + (ToHours * 0.5 ));i+=(ToHours * 0.01))
  {
    X = [];
    
    for(j = (LearningR - (LearningR * 0.5 )) ; j <= (LearningR + (LearningR * 0.5 )) ; j+=(LearningR * 0.01))
    {      
        X.push(model_learning(LwRatio,j,i)); 
    }

    Z.push(X);
  }

  return Z;
}

function compute_winProbability(elo)
{
  var x = [];
  var y = [];
  
  var _from = 800;
  var _end = 3000;

  for(var i = _from ; i<= _end; i+=10)
  {
      /* EQUATION   wp = 1 / (1 + 10) ^ (-delta/ 400)       ; delta= Elo1 - Elo2       | thi is a easy model.     */
       var delta = elo - i;
       var computed_equation = (1 / (1 + Math.pow(10,-delta / 400))) * 100;
        x.push(i);
        y.push(computed_equation);
  }

  return {x_values: x,y_values: y};

}
