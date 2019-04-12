document.addEventListener('DOMContentLoaded', function(){

  // Instantiate Tabs
  const tabs = document.querySelectorAll('.tabs')[0];
  const instance = M.Tabs.init(tabs, {});

  // Find DOM Nodes
  const listNode = document.getElementById('mountNode');

  // Compile template into Fn
  const template = document.getElementById('my_template').innerHTML;
  const templateFn = Handlebars.compile(template);

  // Load cars function so you can call repeatedly
  function loadCars() {
    fetch('/cars', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "application/x-www-form-urlencoded",
      }
    })
    .then(resp => resp.json())
    .then(cars => {
      console.log('cars', cars);
      // Call fn (passing some data). This will return HTML String
      const HTML = templateFn({
        cars
      });

      // Find mountNode and set HTMLString as its innerHTML
      listNode.innerHTML = HTML;
    });
  }

  listNode.addEventListener("click", function(e) {
    // console.log('click', e.target);
      // e.target was the clicked element (unless <i>, then check parent too!
      if (e.target && e.target.matches("button.update")) {
        // update
        console.log('update');
      } else if (e.target && e.target.matches("button.delete")) {
        // delete
        console.log('delete');
      }
  });


  // Add FORM
  const form = document.getElementById('addForm');
  form.addEventListener('submit', function(e){
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const nameValue = nameInput.value;

    const bhpInput = document.getElementById('bhp');
    const bhpValue = bhpInput.value;

    const avatarInput = document.getElementById('avatar');
    const avatarValue = avatarInput.value;

    // console.log('name', nameValue);
    // console.log('bhp', bhpValue);
    // console.log('avatar', avatarValue);

    let formData = new FormData(this);
    console.log('formData', formData, formData.entries);

    // for (let [key, value] in Object.entries(formData)){
    //   console.log('key', key);
    //   console.log('value', value);
    //   // console.dir('thing', thing);
    // }


    // const data = {
    //   name: nameValue,
    //   bhp: bhpValue,
    //   avatar_url: avatarValue
    // };

    fetch('/cars', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
          // "Content-Type": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
      }
    })
    // .then(resp => resp.json())
    .then(cars => {
      M.toast({html: 'Car Saved!', classes: 'success'});
    })
    .catch(err => {
      console.log(error);
      M.toast({html: `Error: ${err.message}`, classes: 'error'});
    });

  });

  loadCars();

});