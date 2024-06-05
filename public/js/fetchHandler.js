export default class FetchHandler {
    constructor() {
        this.CurrentRequests = {};
    }

    GetJSON(url, options) {
        return new Promise((resolve, reject) => {
            const requestName = options.requestName || null;

            if (!requestName || !this.CurrentRequests[requestName]) {
                if (requestName) {
                    this.CurrentRequests[requestName] = true;
                }

                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (requestName) {
                            this.CurrentRequests[requestName] = false;
                        }
                        resolve(data);
                    })
                    .catch(error => {
                        if (requestName) {
                            this.CurrentRequests[requestName] = false;
                        }
                        reject(error);
                    });
            } else {
                console.log("Request being processed. Be patient.");
                reject(new Error("Request being processed. Be patient."));
            }
        });
    }
}
// yooo