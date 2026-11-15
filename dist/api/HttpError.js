export class HttpError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
    }
}
//# sourceMappingURL=HttpError.js.map