import {getEnumLabels, parseQueryParams} from "./base";

export enum MenuItems {
    Home,
    Poems,
    Books
}

function menuItemAsString(item: MenuItems): string {
    switch (item) {
        case MenuItems.Home: return 'Home';
        case MenuItems.Books: return 'Books';
        case MenuItems.Poems: return 'Poems';
    }
}

function stringAsMenu(item: string): MenuItems | null {
    switch (item) {
        case 'Home': return MenuItems.Home;
        case 'Books': return MenuItems.Books;
        case 'Poems': return MenuItems.Poems;
        default: return null;
    }
}

const routes = getEnumLabels(MenuItems);

export function getRoute(search: string): MenuItems | null {
    const values = parseQueryParams(search)
        .filter(x => x[0] === 'route');

    if (values.length === 0) {
        return null;
    }

    const [_, value] = values[0];

    if (routes.filter(x => x === value).length > 0) {
        return stringAsMenu(value);
    }

    return null;
}
