var listNode = document.getElementById('carsList');


function createCarHTML(car){
    return `<li>${car.name}</li>`;
}

fetch('http://localhost:3333/cars')
    .then(resp => {
        return resp.json();
    })
    .then(data => {
        console.log(data);
        data.forEach(car => {
            var carHTML = createCarHTML(car);
            console.log(carHTML);
            listNode.innerHTML += carHTML;
        });
    });
