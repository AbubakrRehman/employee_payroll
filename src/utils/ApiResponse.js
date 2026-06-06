class ApiResponse {
    constructor(statusCode, data = null, message = null) {
        this.success = statusCode < 400; // Automatically true for 2xx status codes
        this.statusCode = statusCode;
        if (data !== null) {
            this.data = data;
        }

        if (this.success === false) {
            this.message = message;
        }
    }

    // Helper helper to quickly send the response
    static send(res, statusCode, data = null) {
        const response = new ApiResponse(statusCode, data);
        return res.status(statusCode).json(response);
    }
}

export default ApiResponse;