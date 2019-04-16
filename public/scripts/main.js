document.addEventListener("DOMContentLoaded", function() {
  // Instantiate Tabs
  const tabs = document.querySelectorAll(".tabs")[0];
  const instance = M.Tabs.init(tabs, {});

  const updateTabTrigger = document.getElementById('updateTabTrigger');

  // Find DOM Nodes
  const listNode = document.getElementById("mountNode");

  // Compile template into Fn
  const template = document.getElementById("my_template").innerHTML;
  const templateFn = Handlebars.compile(template);

  let _cars = [];

  // Load cars function so you can call repeatedly
  function loadCars() {
    fetch("/cars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
        // "Content-Type": "application/x-www-form-urlencoded",
      }
    })
      .then(resp => resp.json())
      .then(cars => {
        console.log("cars", cars);
        // populate cars array
        _cars = cars
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
    if (e.currentTarget) {
      const id = e.currentTarget.dataset.id;
      console.log("id", id);
      if (e.currentTarget.matches("button.update")) {
        // update
        console.log("update");
        updateCar(id);

      } else if (e.currentTarget.matches("button.delete")) {
        // delete
        console.log("delete");
        deleteCar(id);
      }
    }
  });

  function reloadList() {
    loadCars();
    instance.select('listTab');
  }

  function deleteCar(id) {
    fetch(`/cars/${id}`, {
      method: 'DELETE'
    })
      .then(resp => {
        console.log('resp', resp);
        M.toast({ html: "Car Deleted!", classes: "success" });
        loadCars();
      })
      .catch(err => {
        console.log('err', err);
        M.toast({ html: `Error: ${err.message}`, classes: "error" });
      });
  }

  const updateForm = document.getElementById("updateForm");
  updateForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const formdata = serializeFormToArray(this);
    console.log('formdata', formdata);
    const data = {};
    formdata.forEach(obj => {
      data[obj.name] = obj.value
    });
    console.log('data', data, data.id);
    // return;
    fetch(`/cars/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      // .then(resp => resp.json())
      .then(cars => {
        this.reset();
        M.toast({ html: "Car Updated!", classes: "success" });
        reloadList();
        updateTabTrigger.parentNode.classList.add('disabled');
      })
      .catch(err => {
        console.log(error);
        M.toast({ html: `Error: ${err.message}`, classes: "error" });
      });
  });
  function updateCar(id) {
    updateTabTrigger.parentNode.classList.remove('disabled');
    instance.select('updateTab');
    console.log(updateForm, updateForm.querySelectorAll('#id'));
    updateForm.querySelectorAll('#id')[0].value = id;
    const carToBeUpdated = _cars.find(car => {
      return car._id === id;
    });
    populateForm(updateForm, carToBeUpdated);
  }

  // Add FORM
  const addForm = document.getElementById("addForm");
  addForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const formdata = serializeFormToArray(this);
    console.log('data', formdata);
    const data = {};
    formdata.forEach(obj => {
      data[obj.name] = obj.value
    });

    console.log('data', data);

    fetch("/cars", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      // .then(resp => resp.json())
      .then(cars => {
        this.reset();
        M.toast({ html: "Car Saved!", classes: "success" });
        reloadList();
      })
      .catch(err => {
        console.log(error);
        M.toast({ html: `Error: ${err.message}`, classes: "error" });
      });
  });






  // Form Utility functions
  function populateForm(form, data) {
    for (const item in data) {
      const el = form.querySelectorAll(`input[name="${item}"]`);
      if (el.length) {
        el[0].value = data[item];
      }
    }
  }

  
function serializeFormToArray (form) {
    var field, l, s = [];
    if (typeof form === 'object' && form.nodeName === "FORM") {
        var len = form.elements.length;
        for (let i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit' && field.type !== 'button') {
                if (field.type === 'select-multiple') {
                    l = form.elements[i].options.length; 
                    for (let j=0; j<l; j++) {
                        if(field.options[j].selected)
                            s[s.length] = { name: field.name, value: field.options[j].value };
                    }
                } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                    if (field.type === 'number') {
                        s[s.length] = { name: field.name, value: Number(field.value) };
                    } else {
                        s[s.length] = { name: field.name, value: field.value };
                    } 
                } else {
                  let bool = false;
                  if (field.checked) bool = true;
                  s[s.length] = { name: field.name, value: bool }
                }
            }
        }
    }
    return s;
};

  // Running order
  loadCars();
});
