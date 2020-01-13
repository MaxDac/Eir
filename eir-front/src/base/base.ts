import {DataGetter} from "./data-getter";
import {HelpServices} from "../services/helpServices";

export function isNotNull(s: any): boolean {
    return s !== null && s !== undefined
}

export function isNotNullNorEmpty(s: string): boolean {
    return isNotNull(s) && s !== '';
}

export interface DataComponentProps {
    getter: DataGetter;
}

export function getEnumLabels<T>(e: T): string[] {
    let returnValue: string[] = [];

    for (const key in e) {
        if (isNaN(key as any)) {
            returnValue.push(key.toString());
        }
    }

    return returnValue;
}

export function service(props: DataComponentProps): HelpServices {
    if (!isNotNull(props.getter)) {
        throw Error('No data getter');
    }

    return new HelpServices(props.getter as DataGetter);
}

function separateEquals(param: string): [string, string] | null {
    if (param.indexOf('=') === -1) {
        return null;
    }

    const divided = param.split('=');

    if (divided.length !== 2 || !isNotNullNorEmpty(divided[0]) || !isNotNullNorEmpty(divided[1])) {
        return null;
    }

    return [divided[0], divided[1]];
}

export function parseQueryParams(pars: string): [string, string][] {
    if (pars.indexOf('?') === -1) {
        return [];
    }

    const parts = pars
        .replace('?', '')
        .split('&')
        .filter(isNotNullNorEmpty);

    if (parts.length === 0) {
        return [];
    }

    return parts
        .map(separateEquals)
        .filter(x => x !== null) as [string, string][];
}
