/**
 * Returns the current date in the format yyyy-dd-mm
 *
 * @returns {string}
 */
function getCurrentDateForUrl() {
    const now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1; // January is 0!
    const yyyy = now.getFullYear();

    // Add leading zeros if day or month is below 10
    if (dd < 10) {
        dd = `0${dd}`;
    }
    if (mm < 10) {
        mm = `0${mm}`;
    }

    return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format date ISO string to a human readable string
 *
 * @param {String} date - ISO Date string (e.g. "2018-09-19T02:30:00Z")
 *
 * @returns {String} - Formatted date string (e.g. Wednesday, September 19, 2018, 2:30)
 */
function formatDateToString(date) {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    };
    return new Date(date).toLocaleDateString("en", options);
}

/**
 * Log request response error to console
 *
 * @param {string}
 */
function logError(error) {
    console.error("Looks like there was a problem: \n", error);
}

/**
 * Validate request response
 * Returns request if successful, errors if not
 *
 * @param {Promise} response - Response promise
 *
 * @returns {Promise}
 */
function validateResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

/**
 * Process the response and return JSON
 *
 * @param {Promise} response - Response promise
 *
 * @returns {Object}
 */
function readResponseAsJSON(response) {
    return response.json();
}

/**
 *
 *
 * @param {Promise} response - Response promise
 *
 * @returns {URLSearchParams}
 */
function getUrlWithParams(urlString, urlParams) {
    let url = new URL(urlString);
    url.search = new URLSearchParams(urlParams);
    return url;
}

/**
 * Perform fetch of a provided URL
 * Executes callback function on completion
 *
 * @param {string} urlString - URL of data to get
 * @param {function} callback - Callback function to be called upon success
 */
function fetchJSON(url, callback) {
    if (typeof url !== "string") {
        url = getUrlWithParams(url.path, url.params);
    }
    fetch(url)
        .then(validateResponse)
        .then(readResponseAsJSON)
        .then(callback)
        .catch(logError);
}

/**
 * Create an element and append a text node
 *
 * @param {string} tagName - Element tag name
 * @param {string} text - Text to be appended to element
 *
 * @returns {Element} - The element to be added to the document
 */
function createElementWithText(tagName, text) {
    let element = document.createElement(tagName);
    let textNode = document.createTextNode(text);
    element.appendChild(textNode);
    return element;
}

/**
 * Append multiple elements to a parent element
 *
 * @param {Element} parentElement - Element to have children injected into
 * @param {Element[]} childElements - Array of child elements to append to parent
 *
 * @returns {Element} - The parent element containing child elements
 */
function appendChildrenToElement(parentElement, childElements) {
    childElements.forEach(function(child) {
        parentElement.appendChild(child);
    });
    return parentElement;
}
