export default class Dropdown {
    container: HTMLSelectElement;
    name: string;
    constructor(name: string, options: Array<{value: string, name: string}>) {
        this.name = name;
        this.container = document.createElement('select');
        this.container.className = 'gigasheet-select';
        let str = '';
        for(let option of options) {
            str += `<option value="${option.value}">${option.name}</option>`
        }
        this.container.innerHTML = str;
    }
    set(value: string) {
        const temps = Array.from(this.container.querySelectorAll('option[data-temp="true"]')) as HTMLOptionElement[];
        for (const t of temps) t.remove();

        const found = Array.from(this.container.options).some(o => o.value === value);
        if (found) {
            this.container.value = value;
            return;
        }

        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = value;
        opt.setAttribute('data-temp', 'true');
        opt.selected = true;
        this.container.appendChild(opt);
        this.container.value = value;
    }
}