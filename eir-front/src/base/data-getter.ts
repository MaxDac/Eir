function dummyPromise<T>(dummy: T | any): Promise<T> {
    return new Promise<T>((res, _) => {
        res(dummy as T);
    })
}

export interface DataRequest {
    url: string;
    body: any;
}

export interface DataGetter {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, body: any): Promise<T>;
}

export class TestDataGetter implements DataGetter {
    get<T>(url: string): Promise<T> {
        return dummyPromise<T>([]);
    }

    post<T>(url: string, body: any): Promise<T> {
        throw Error('Not yet defined');
    }
}

export class DefaultDataGetter implements DataGetter {
    private getCompleteUri(uri: string): string {
        return `${this.baseUri}${uri}`;
    }

    constructor(private baseUri: string) { }

    get<T>(url: string): Promise<T> {
        return fetch(this.getCompleteUri(url), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(x => x.json())
            .then(el => el as T);
    }

    post<T>(url: string, body: any): Promise<T> {
        return fetch(this.getCompleteUri(url), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
            .then(x => x.json())
            .then(el => el as T);
    }
}
