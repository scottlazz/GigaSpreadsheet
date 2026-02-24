export default class Dropdown {
    constructor(name, options) {
        this.name = name;
        this.container = document.createElement('select');
        this.container.className = 'gigasheet-select';
        let str = '';
        for (let option of options) {
            str += `<option value="${option.value}">${option.name}</option>`;
        }
        this.container.innerHTML = str;
    }
}
