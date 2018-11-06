/*******************************
* @param form (Element) - the form whose inputs you wish to serialise
* @returns An array of name/value pairs
*******************************/
export const serializeFormToArray = (form) => {
    var field, l, s = [];
    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (var i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    l = form.elements[i].options.length; 
                    for (j=0; j<l; j++) {
                        if(field.options[j].selected)
                            s[s.length] = { name: field.name, value: field.options[j].value };
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    if (field.type === 'number') {
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

/*******************************
* @param form (Element) - the form whose inputs you wish to serialise
* @param data (Object) - the form whose inputs you wish to populate
* @returns void
*******************************/
export const populateForm = (form, data) => {
    for (const item in data) {
        const el = form.querySelectorAll(`input[name="${item}"]`);
        if (el.length){
            el[0].value = data[item];
        }
        
    }
};