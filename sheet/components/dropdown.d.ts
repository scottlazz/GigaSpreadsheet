export default class Dropdown {
    container: HTMLSelectElement;
    name: string;
    constructor(name: string, options: Array<{
        value: string;
        name: string;
    }>);
}
