document.addEventListener("DOMContentLoaded", function() {
  // Instantiate Tabs
  const tabs = document.querySelector(".tabs");
  const instance = M.Tabs.init(tabs, {});

  const updateTabTrigger = document.getElementById("updateTabTrigger");

  // Find DOM Nodes
  const listNode = document.getElementById("carsList");

  // Compile template into Fn
  // const template = document.getElementById("my_template").innerHTML;
  // const templateFn = Handlebars.compile(template);

  let _cars = [];

  const apiRoot = "/api/";
  const version = "v1";
  const fullAPIRoot = apiRoot + version;

  // Load cars function so you can call repeatedly
  function loadCars(handler = renderCarsList) {
    fetch(`${fullAPIRoot}/cars`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => resp.json())
      .then(cars => {
        _cars = cars;
        console.log("cars", cars);
        handler(cars);
      });
  }

  function renderCarsList(cars) {
    if (!cars.length) {
      const noCarsMessage = document.createElement("p");
      noCarsMessage.classList.add("no-items-message");
      noCarsMessage.textContent = "No Cars to display";
      listNode.innerHTML = "";
      listNode.append(noCarsMessage);
      return;
    }
    const ul = document.createElement("ul");

    // object.entries() returns an array like [[0, 'thing1'], [1, 'thing2']]
    for (let [index, car] of cars.entries()) {
      // console.log("car", car);
      // console.log("index", index);

      // Create the li
      const li = document.createElement("li");
      li.classList.add("collection-item", "avatar");
      li.innerHTML = `<img src="${car.avatar_url}" alt="${car.name}" class="circle">
                  <dl>
                    <dt>Name: </dt>
                    <dd class="title">${car.name}</dd>
                    <dt>BHP: </dt>
                    <dd>${car.bhp}</dd>
                  </dl>
                  <div class="controls">
                    <button class="btn btn-info update" data-id="${car._id}">
                        <i class="material-icons left">edit</i>
                        Edit
                    </button>
                    <button class="btn btn-info delete" data-id="${car._id}">
                        <i class="material-icons left">delete</i>
                        Delete
                    </button>
                  </div>
              </li>`;
      li.dataset.id = car._id; //provided by the database automatically

      // append the li to the list
      ul.append(li);
    }

    // clear out old list content
    listNode.innerHTML = "";

    // append the frag
    listNode.append(ul);

    M.updateTextFields();
  }

  listNode.addEventListener("click", function(e) {
    const target = e.target;
    if (target) {
      if (target.matches("button.update")) {
        console.log("update", target);
        updateCar(getDataAttributeValue(target, "id"));
      } else if (target.matches("button.delete")) {
        console.log("delete");
        deleteCar(getDataAttributeValue(target, "id"));
      }
    }
  });

  function reloadList() {
    loadCars();
    instance.select("listTab");
  }

  function getDataAttributeValue(node, field) {
    const data = node.dataset[field];
    if (!data) throw new Error(`No id was found on DOM node`);
    return data;
  }

  function getFormData(form) {
    if (!form) throw new Error("No form provided to getFormData method");
    return Object.fromEntries(new FormData(form));
  }

  function deleteCar(id) {
    fetch(`${fullAPIRoot}/cars/${id}`, {
      method: "DELETE"
    })
      .then(resp => {
        console.log("resp", resp);
        M.toast({ html: "Car Deleted!", classes: "success" });
        loadCars();
      })
      .catch(err => {
        console.log("err", err);
        M.toast({ html: `Error: ${err.message}`, classes: "error" });
      });
  }

  const updateForm = document.getElementById("updateForm");
  updateForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const data = getFormData(updateForm);

    // return;
    fetch(`${fullAPIRoot}/cars/${data.id}`, {
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
        updateTabTrigger.parentNode.classList.add("disabled");
      })
      .catch(err => {
        console.log(error);
        M.toast({ html: `Error: ${err.message}`, classes: "error" });
      });
  });

  function updateCar(id) {
    // undisable and select tab
    updateTabTrigger.parentNode.classList.remove("disabled");
    instance.select("updateTab");

    // Find car by Id
    const carToBeUpdated = _cars.find(car => {
      console.log(car._id, id);
      return car._id === id;
    });
    if (!carToBeUpdated) throw new Error(`Car not found for id: ${id}`);

    // Insert id value in hidden id field
    // console.log(updateForm, updateForm.querySelector('#id'));
    updateForm.querySelector("#id").value = id;

    // Populate the form
    populateForm(updateForm, carToBeUpdated);

    // update fields so labels don't sag (sort of a bug in materialize)
    M.updateTextFields();
  }

  // Add FORM
  const addForm = document.getElementById("addForm");
  addForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Get the data from the form
    const data = getFormData(addForm);
    console.log("data", data);

    // Make the call
    fetch(`${fullAPIRoot}/cars`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      // .then(resp => resp.json())
      .then(cars => {
        addForm.reset();
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

  // Running order
  loadCars();
  if (!_cars.length) {
    instance.select("addTab");
  }
});
