document.addEventListener("DOMContentLoaded", function() {
  // Instantiate Tabs
  const tabs = document.querySelectorAll(".tabs")[0];
  const instance = M.Tabs.init(tabs, {});

  // Find DOM Nodes
  const listNode = document.getElementById("mountNode");

  // Compile template into Fn
  const template = document.getElementById("my_template").innerHTML;
  const templateFn = Handlebars.compile(template);

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
    if (e.target) {
      const id = e.target.dataset.id;
      if (e.target.matches("button.update")) {
        // update
        console.log("update", e.target.dataset.id, id);
      } else if (e.target.matches("button.delete")) {
        // delete
        // console.log("delete");

        const updateTabTrigger = document.getElementById('updateTabTrigger');
        updateTabTrigger.parentNode.classList.remove('disabled');
        instance.select('updateTab');
      }
    }
  });

  // Add FORM
  const form = document.getElementById("addForm");
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const nameValue = nameInput.value;

    const bhpInput = document.getElementById("bhp");
    const bhpValue = bhpInput.value;

    const avatarInput = document.getElementById("avatar");
    const avatarValue = avatarInput.value;

    // console.log('name', nameValue);
    // console.log('bhp', bhpValue);
    // console.log('avatar', avatarValue);

    const data = {
      name: nameValue,
      bhp: bhpValue,
      avatar_url: avatarValue
    };

    fetch("/cars", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      // .then(resp => resp.json())
      .then(cars => {
        M.toast({ html: "Car Saved!", classes: "success" });
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

  serializeFormToArray = form => {
    var field,
      l,
      s = [];
    if (typeof form == "object" && form.nodeName == "FORM") {
      var len = form.elements.length;
      for (var i = 0; i < len; i++) {
        field = form.elements[i];
        if (
          field.name &&
          !field.disabled &&
          field.type != "file" &&
          field.type != "reset" &&
          field.type != "submit" &&
          field.type != "button"
        ) {
          if (field.type == "select-multiple") {
            l = form.elements[i].options.length;
            for (j = 0; j < l; j++) {
              if (field.options[j].selected)
                s[s.length] = {
                  name: field.name,
                  value: field.options[j].value
                };
            }
          } else if (
            (field.type != "checkbox" && field.type != "radio") ||
            field.checked
          ) {
            if (field.type === "number") {
              s[s.length] = { name: field.name, value: Number(field.value) };
            } else {
              s[s.length] = { name: field.name, value: field.value };
            }
          }
        }
      }
    }
    return s;
  };

  // Running order
  loadCars();
});
