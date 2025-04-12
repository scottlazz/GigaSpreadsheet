export const header = `
<style>
    .header-bar {
        font-family: Arial, sans-serif;
        background-color: #f3f3f3;
        padding: 5px;
        border-bottom: 1px solid #d4d4d4;
        display: flex;
        flex-wrap: wrap;
        z-index: 300;
    }

    .tab-group {
        display: flex;
        margin-right: 15px;
    }

    .button-group {
        display: flex;
        border-right: 1px solid #d4d4d4;
        padding: 3px 10px 3px 3px;
        align-items: center;
    }

    .button {
        background: none;
        border: none;
        padding: 5px 8px;
        margin: 0 2px;
        cursor: pointer;
        border-radius: 3px;
    }

    .button:hover {
        background-color: #e0e0e0;
    }

    .button img {
        width: 16px;
        height: 16px;
    }

    .separator {
        width: 1px;
        background-color: #d4d4d4;
        margin: 0 5px;
        height: 30px;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 130px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        font-size: 14px;
        border: 1px solid #d4d4d4;
    }
    .dropdown-content > div {
        border-bottom: 1px solid #d4d4d4;
        padding: 2px;
        cursor: pointer;
    }

    .dropdown-content > div:last-child {
        border-bottom: none;
    }

    .dropdown:hover .dropdown-content {
        display: block;
        z-index: 300;
    }
</style>
<div class="header-bar">
    <!-- Clipboard Group -->
    <div class="button-group quick-text-actions-buttons">
        <button class="button" data-action="paste" title="Paste">📋</button>
        <button class="button" data-action="cut" title="Cut">✂️</button>
        <button class="button" data-action="copy" title="Copy">📄</button>
        <div class="separator"></div>
        <div class="dropdown">
            <button id="format-button" class="button" title="Format Painter">🖌️</button>
        </div>
    </div>

    <!-- Font Group -->
    <div class="button-group">
        <div class="dropdown">
            <button class="button" title="Font">Arial ▼</button>
            <div class="dropdown-content">
                <div>Arial</div>
                <div>Calibri</div>
                <div>Times New Roman</div>
            </div>
        </div>
        <div class="dropdown">
            <button class="button" title="Font Size">11 ▼</button>
        </div>
        <button class="button" title="Bold">B</button>
        <button class="button" title="Italic">I</button>
        <button class="button" title="Underline">U</button>
        <div class="separator"></div>
        <button class="button" title="Border">⧉</button>
        <div class="dropdown">
            <button class="button" title="Fill Color">▣</button>
        </div>
        <div class="dropdown">
            <button class="button" title="Font Color">A</button>
        </div>
    </div>

    <!-- Alignment Group -->
    <div class="button-group align-button-group">
        <button class="button" data-align="left" title="Align Left">≡</button>
        <button class="button" data-align="center" title="Align Center">≡</button>
        <button class="button" data-align="right" title="Align Right">≡</button>
        <div class="separator"></div>
        <button class="button" title="Merge & Center" id="merge-button">⧉ M</button>
    </div>

    <!-- Editing Group -->
    <div class="button-group">
        <div class="dropdown">
            <button class="button" title="Insert">⊕ Insert</button>
        </div>
        <div class="dropdown">
            <button class="button" title="Delete">⊖ Delete</button>
        </div>
        <div class="separator"></div>
        <div class="dropdown">
            <button class="button" title="Conditional Formatting">☰ Format</button>
        </div>
    </div>
</div>
`