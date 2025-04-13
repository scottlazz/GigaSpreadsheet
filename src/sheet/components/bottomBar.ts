export class BottomBar {
    container: HTMLDivElement;
    tabCbs: Function[];
    menu: HTMLElement;
    active: string | number;
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'gigasheet-bottombar';
        this.container.innerHTML = `
            <div class="gigasheet-contextmenu" style="width: 160px; display: none; left: 271px; bottom: 41px;">
                <div class="gigasheet-item">Delete</div>
            </div>
            <ul class="gigasheet-menu">
                <li class="">
                    <div class="gigasheet-icon">
                        <div class="gigasheet-icon-img add"></div>
                    </div><span class="">
                        <div class="gigasheet-dropdown top-left">
                            <div class="gigasheet-dropdown-header">
                                <div class="gigasheet-icon">
                                    <div class="gigasheet-icon-img ellipsis"></div>
                                </div>
                            </div>
                            <div class="gigasheet-dropdown-content" style="width: auto; display: none;">
                                <div class="gigasheet-item" style="width: 150px; font-weight: normal;">Sheet1</div>
                            </div>
                        </div>
                    </span>
                </li>
            </ul>
        `
        this.menu = this.container.querySelector('.gigasheet-menu')!;
        this.active = 1;
        this.tabCbs = [];
        this.addListeners();
    }
    addListeners() {
        this.menu.addEventListener('click', (e: any) => {
            if (e.target.hasAttribute('data-tabid')) {
                if (e.target.getAttribute('data-tabid') === String(this.active)) return;
                this.setActive(e.target.getAttribute('data-tabid'));
            }
        })
    }
    setActive(id: string | number) {
        const el = this.container.querySelector(`[data-tabid='${id}']`);
        if (!el) return;
        this.removeActive();
        this.active = id;
        el.classList.add('active');
        this.emit(id)
    }
    emit(value: any) {
        this.tabCbs.forEach(fn => {
            fn(value);
        })
    }
    onTabClicked(fn: Function) {
        this.tabCbs.push(fn);
    }
    removeActive() {
        const tabContainer = this.container.querySelector('.gigasheet-menu')!;
        for (let tab of tabContainer.children) {
            tab.classList.remove('active');
        }
    }
    addTab(name: string, id: number) {
        const container = this.container;
        this.active = id;
        const tabContainer = container.querySelector('.gigasheet-menu')!;
        this.removeActive();
        if (tabContainer.lastElementChild) {
            tabContainer.lastElementChild!.insertAdjacentHTML(
                'afterend',
                `<li data-tabid="${id}" class="active">Sheet${id}</div>`
            )
        } else {
            tabContainer.innerHTML = '<li data-tabid="1" class="active gigasheet-bottom-tab">Sheet1</li>'
        }
    }
}