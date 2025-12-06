export default function tooltip(target: any, text: string) {
    if (target.classList.contains('active')) {
        return;
    }
    const {
        left, top, width, height,
    } = target.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'gigasheet-tooltip';
    el.innerText = text || '';

    document.body.appendChild(el);
    const elBox = el.getBoundingClientRect();
    el.style.left = `${left + (width / 2) - (elBox.width / 2)}px`;
    el.style.top = `${top + height + 6}px`;
    target.onmouseleave = () => {
        if (document.body.contains(el)) {
            document.body.removeChild(el);
        }
    }
    target.onclick = () => {
        if (document.body.contains(el)) {
            document.body.removeChild(el);
        }
    }
}
