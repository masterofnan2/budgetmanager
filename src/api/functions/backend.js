const backendUrl = process.env.REACT_APP_API_URL;

/**
 * 
 * @param {string} route The route path to fetch
 * @param {object} json The payload
 * @param {string|null} method the Http request method, defaults to GET
 * @returns promise|object
 */
export default async function backend(route = "/", payload = {}, method = "get") {
    const response = {
        data: null,
        errors: null,
        exception: null,
    }

    let Headers = {
        method: method.toUpperCase(),
        headers: {
            'content-type': 'application/json',
            'X-Auth-Token': localStorage.getItem("token"),
            'Content-Language': document.documentElement.lang
        }
    }

    if (method.toUpperCase() !== 'GET') {
        Headers.body = JSON.stringify(payload);
    }

    await fetch(backendUrl + route, Headers)
        .then(res => res.json())
        .then(feedback => {
            if (feedback.errors) {
                response.errors = feedback.errors;
            } else if (feedback.exception) {
                response.exception = feedback.exception;
            } else if (feedback.authenticated === false) {
                window.location.reload();
            } else {
                response.data = feedback;
            }
        })
        .catch(error => {
            response.exception = error.message;
        });

    return response;
}