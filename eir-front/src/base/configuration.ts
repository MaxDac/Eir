import {DefaultDataGetter} from "./data-getter";
import {isNotNull, isNotNullNorEmpty} from "./base";

export function getBaseUrlFromPage(): string {
    return getBaseUrl(window.location.href);
}

export function getBaseUrl(currentUrl: string): string {
    const parts = currentUrl.split('/').filter(isNotNullNorEmpty);
    return `${parts[0]}//${parts[1]}`;
}

export interface EnvConfiguration {
    backEndUrl: string
}

export interface AppConfiguration {
    [key: string]: EnvConfiguration
}

export const configuration: AppConfiguration = {
    // Development
    ["http://localhost:3000"]: {
        backEndUrl: 'http://localhost:8080'
    },
    // Production
    ["https://rhodes-gallery.azurewebsites.net"]: {
        backEndUrl: 'https://rhodes-gallery.azurewebsites.net'
    }
};

let registeredBackEndUrl: string = '';

export function backEndUrl(): string {
    if (registeredBackEndUrl === '') {
        const config = configuration[getBaseUrlFromPage()];
        if (isNotNull(config)) {
            registeredBackEndUrl = config.backEndUrl
        }
    }

    return registeredBackEndUrl;
}

export function dataGetterFromConfig(c: EnvConfiguration) {
    return new DefaultDataGetter(c.backEndUrl);
}
