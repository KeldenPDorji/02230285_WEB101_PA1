// public/js/ajaxHandler.js

export default class AJAX {
    constructor() {
        this.CurrentRequests = {};
    }

    GetJSON(url, options, callback) {
        const requestName = options.requestName || null;

        if (!requestName || !this.CurrentRequests[requestName]) {
            if (requestName) {
                this.CurrentRequests[requestName] = true;
            }

            $.ajax({
                url: url,
                data: options.data,
                dataType: "json",
                success: (response) => {
                    if (requestName) {
                        this.CurrentRequests[requestName] = false;
                    }
                    callback(null, response);
                },
                error: (request) => {
                    if (requestName) {
                        this.CurrentRequests[requestName] = false;
                    }
                    callback(request, null);
                }
            });
        } else {
            console.log("Request being processed. Be patient.");
        }
    }
}
