export default function drawer(target: any, child: HTMLElement, maxWidth: number = 200) {
    if (target.classList.contains('active')) {
        return;
    }
    const {
        left, top, width, height,
    } = target.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'gigasheet-tooltip';
    el.style.maxWidth = `${maxWidth}px`;
    // el.innerHTML = text || '';
    el.appendChild(child);

    document.body.appendChild(el);
    const elBox = el.getBoundingClientRect();
    el.style.left = `${left + (width / 2) - (elBox.width / 2)}px`;
    el.style.top = `${top + height + 6}px`;
    setTimeout(() => {
        const ondocclick = (event) => {
            if (!el.contains(event.target)) {
                // document.body.removeChild(el);
                el.remove();
                document.removeEventListener('click', ondocclick);
            }
        }
        document.addEventListener('click', ondocclick);

    },0)
    target.onclick = () => {
        if (document.body.contains(el)) {
            document.body.removeChild(el);
        }
    }
}
