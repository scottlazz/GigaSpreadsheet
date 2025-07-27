export class FormulaBar {
    container: HTMLDivElement;
    tabCbs: Function[];
    input: HTMLInputElement;
    textarea: HTMLTextAreaElement;
    // menu: HTMLElement;
    active: string | number;
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'gigasheet-formulabar';
        this.container.innerHTML = `
            <input value="A1" class="gigasheet-name-box"></input>
            <!-- <div class="gigasheet-okcancelcontainer"><button>X</button><button>✓</button><button>fx</button></div> -->&nbsp;
            <textarea spellcheck="false"></textarea>
        `
        // this.menu = this.container.querySelector('.gigasheet-menu')!;
        this.active = 1;
        this.tabCbs = [];
        this.input = this.container.querySelector('.gigasheet-name-box')!;
        this.textarea = this.container.querySelector('textarea')!;
    }
    emit(value: any) {
        this.tabCbs.forEach(fn => {
            fn(value);
        })
    }
}