document.addEventListener('DOMContentLoaded', function(){

  const template = document.getElementById('my_template').innerHTML;

  // Compile template into Fn
  const templateFn = Handlebars.compile(template);


  fetch('/cars', {
    method: 'GET'
  })
  .then(resp => resp.json())
  .then(cars => {
    console.log('cars', cars);
    // Call fn (passing some data). This will return HTML String
    const HTML = templateFn({
      cars
    });

    // Find mountNode and set HTMLString as its innerHTML
    const mountNode = document.getElementById('mountNode');
    mountNode.innerHTML = HTML;
  });

});