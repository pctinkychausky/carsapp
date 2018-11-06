export const makeCall = (url = '', method = 'GET', data = {}, options = {}) => {
    let ops = {
        method,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        referrer: "no-referrer",
    };
    ops.method = method;
    // options.contentType = options.contentType.toLowerCase();
    if (method === 'POST' || method === 'PUT') {
        ops = {...ops, body: JSON.stringify(data)};
    }

    return fetch(url ,ops)
        .then(resp => {
            if (method === 'GET' || method === 'POST'){
                return resp.json();
            } else {
                return true;
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
}