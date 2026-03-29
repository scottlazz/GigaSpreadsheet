const path = require('path');
const fs = require('fs');

function createPackage() {
    console.log('writing package...')
    const packageData = fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf-8')
    const { scripts, devDependencies, ...packageOther } = JSON.parse(packageData);

    const { postpack } = scripts;
    const newPackageData = {
        ...packageOther,
        scripts: {
            postpack
        },
        main: './index.js',
        private: false,
    }
    const buildPath = path.resolve(__dirname, 'dist/package.json');
    fs.writeFileSync(buildPath, JSON.stringify(newPackageData, null, 2))

    const css = fs.readFileSync(path.resolve(__dirname, './src/style.css'))
    const cssPath = path.resolve(__dirname, 'dist/style.css');
    fs.writeFileSync(cssPath, css)
// ./sheet/images/icons.svg
    const svg = fs.readFileSync(path.resolve(__dirname, './src/sheet/images/icons.svg'))
    const svgPath = path.resolve(__dirname, 'dist/sheet/images/icons.svg');
    if (!fs.existsSync('dist/sheet/images')){
        fs.mkdirSync('dist/sheet/images');
    }
    fs.writeFileSync(svgPath, svg)
    return newPackageData;
}

createPackage();