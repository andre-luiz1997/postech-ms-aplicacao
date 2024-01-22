interface RequestProps {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    path?: string;
    headers?: any;
}

export class MicroserviceAdapter {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    get _endpoint() {
        return this.endpoint;
    }

    sendRequest(props: RequestProps) {
        return fetch(this.endpoint + props.path, {
            method: props.method,
            body: JSON.stringify(props.body),
            headers: {
                'Content-Type': 'application/json',
                ...props.headers
            }
        });
    }
}