export interface KioApi {
    submitResult(result: {}): void;
    getResource(id: string): HTMLElement; //TODO is it always an html element?
}

export interface KioTaskSettings {
    level: string
}

export interface KioResourceDescription {
    id: string,
    src: string
}