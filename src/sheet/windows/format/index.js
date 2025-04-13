export function launchFormatMenu() {
    const formatWindow = window.open('', 'target=_blank', 'width=190,height=400');
    formatWindow.document.body.innerHTML = `
        <style>
            .format-menu {
                font-family: Arial, sans-serif;
                width: 220px;
                padding: 12px;
                background: #f8f8f8;
                border: 1px solid #999999;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .menu-section {
                margin-bottom: 12px;
            }
            .menu-title {
                font-weight: bold;
                margin-bottom: 6px;
                color: #555;
                font-size: 13px;
            }
            select, input {
                width: 100%;
                padding: 6px;
                border: 1px solid #ccc;
                border-radius: 3px;
                margin-bottom: 8px;
            }
            .color-options {
                display: flex;
                gap: 4px;
                margin-top: 6px;
            }
            .color-option {
                width: 20px;
                height: 20px;
                border-radius: 3px;
                cursor: pointer;
                border: 1px solid #999999;
            }
            .format-btn {
                flex: 1;
                padding: 6px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
                text-align: center;
                font-size: 12px;
            }
            .format-btn:hover {
                background: #f0f0f0;
            }
            .format-btn.active {
                background: #999999;
                border-color: #999;
            }
            .color-option:hover {
                border-color: #999;
            }
            .alignment-options,.border-options {
                display: flex;
                gap: 4px;
            }
            .alignment-btn,.border-btn {
                flex: 1;
                padding: 6px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
                text-align: center;
            }
            .alignment-btn:hover,.border-btn:hover {
                background: #f0f0f0;
            }
            .alignment-btn.active,.border-btn.active {
                background: #999999;
                border-color: #999;
            }
            .baseline-visual {
                display: inline-block;
                width: 100%;
                height: 40px;
                position: relative;
                margin-top: 8px;
                border: 1px solid #eee;
                background: repeating-linear-gradient(
                    to bottom,
                    #f8f8f8,
                    #f8f8f8 1px,
                    #fff 1px,
                    #fff 10px
                );
            }
            .baseline-line {
                position: absolute;
                left: 0;
                right: 0;
                height: 1px;
                background-color: red;
            }
            .baseline-text {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
            }
        </style>
        <div class="format-menu">
            <div class="menu-section">
                <div class="menu-title">Cell Type</div>
                <select id="cellType">
                    <option value="text" selected>Text</option>
                    <option value="button">Button</option>
                    <option value="linechart">Line Chart</option>
                </select>
            </div>
            <div class="menu-section">
                <div class="menu-title">Font Size</div>
                <select id="fontSize">
                    <option value="8">8</option>
                    <option value="10" selected>10</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                </select>
            </div>
            <div class="menu-section">
                <div class="menu-title">Font Color</div>
                <input type="color" id="fontColor" value="#000000">
                <div class="color-options">
                    <div class="color-option" style="background: #000000;" data-color="#000000"></div>
                    <div class="color-option" style="background: #ff0000;" data-color="#ff0000"></div>
                    <div class="color-option" style="background: #00aa00;" data-color="#00aa00"></div>
                    <div class="color-option" style="background: #0000ff;" data-color="#0000ff"></div>
                    <div class="color-option" style="background: #ff9900;" data-color="#ff9900"></div>
                </div>
            </div>
            <div class="menu-section">
                <div class="menu-title">Text Alignment</div>
                <div class="alignment-options">
                    <div class="alignment-btn" data-align="left" title="Align Left">⎡</div>
                    <div class="alignment-btn" data-align="center" title="Align Center">⎢</div>
                    <div class="alignment-btn" data-align="right" title="Align Right">⎣</div>
                </div>
            </div>
            <div class="menu-section">
                <div class="menu-title">Borders</div>
                <div class="border-options">
                    <div class="border-btn" data-border="${(1 << 1)}" title="Border Left">Left</div>
                    <div class="border-btn" data-border="${(1 << 2)}" title="Border Top">Top</div>
                    <div class="border-btn" data-border="${(1 << 3)}" title="Border Right">Right</div>
                    <div class="border-btn" data-border="${(1 << 4)}" title="Border Bottom">Bottom</div>
                </div>
            </div>
            <div class="menu-section">
            <div class="menu-title">Text Baseline</div>
                <div class="option-group">
                    <div class="format-btn" data-baseline="alphabetic" title="Alphabetic">A</div>
                    <div class="format-btn" data-baseline="top" title="Top">Top</div>
                    <div class="format-btn" data-baseline="middle" title="Middle">Mid</div>
                    <div class="format-btn" data-baseline="bottom" title="Bottom">Bot</div>
                </div>
                <div class="baseline-visual" id="baselineDemo">
                    <div class="baseline-line" id="baselineIndicator"></div>
                    <div class="baseline-text" id="baselineText">Text</div>
                </div>
            </div>
        </div>
    `;
    const cbs = [];
    function onChange(type, value) {
        for(let cb of cbs) {
            cb(type,value);
        }
    }
    formatWindow.document.title = 'Format Menu';
    formatWindow.document.getElementById('fontSize').addEventListener('change', function () {
        onChange('fontSize', this.value);
    });
    formatWindow.document.getElementById('cellType').addEventListener('change', function () {
        onChange('cellType', this.value);
    });
    formatWindow.document.getElementById('fontColor').addEventListener('input', function () {
        onChange('color', this.value);
    });
    // Quick color options
    formatWindow.document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function () {
            const color = this.getAttribute('data-color');
            formatWindow.document.getElementById('fontColor').value = color;
            onChange('color', color);
        });
    });
    // Alignment buttons
    formatWindow.document.querySelectorAll('.alignment-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            formatWindow.document.querySelectorAll('.alignment-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
            const alignment = this.getAttribute('data-align');
            onChange('textAlign', alignment);
        });
    });
    // Border buttons
    formatWindow.document.querySelectorAll('.border-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            let border = 0;
            formatWindow.document.querySelectorAll('.border-btn.active').forEach(function (b) {
                const databorder = b.getAttribute('data-border');
                border |= databorder;
            });
            // Remove active class from all buttons
            // const border = this.getAttribute('data-border');
            onChange('border', border);
        });
    });
    // Baseline buttons
    formatWindow.document.querySelectorAll('[data-baseline]').forEach(function (btn) {
        // Update baseline visual demonstration
        const baselineOptions = {
            'alphabetic': { position: 30, description: 'Normal text baseline' },
            'top': { position: 5, description: 'Top of the em square' },
            'middle': { position: 20, description: 'Middle of the em square' },
            'bottom': { position: 35, description: 'Bottom of the em square' },
            'hanging': { position: 5, description: 'Hanging baseline (like Hindi)' },
            'ideographic': { position: 35, description: 'Ideographic baseline (like CJK)' }
        };
        function updateBaselineVisual(baseline) {
            const demo = formatWindow.document.getElementById('baselineDemo');
            const indicator = formatWindow.document.getElementById('baselineIndicator');
            const text = formatWindow.document.getElementById('baselineText');
            if (baselineOptions[baseline]) {
                const pos = baselineOptions[baseline].position;
                indicator.style.top = `${pos}px`;
                text.style.top = `${pos}px`;
                text.textContent = baseline;
            }
        }
        btn.addEventListener('click', function () {
            formatWindow.document.querySelectorAll('[data-baseline]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const baseline = this.getAttribute('data-baseline');
            updateBaselineVisual(baseline);
            onChange('textBaseline', baseline);
        });
    });
    return {win: formatWindow, addListener: (fn) => cbs.push(fn)};
}