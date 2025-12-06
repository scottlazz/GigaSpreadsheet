export const dependencyTree: any = {

};

export const reverseDependencyTree: any = {

};

export const tickerReg: any = {

};

function isEmpty(obj: any) {
    for(let i in obj) {
        if (obj.hasOwnProperty(i)) return false;
    }
    return true;
}

export function shiftDependenciesUp(pivotRow: any) {
    const cellsToUpdate: any = {};
    function helper(tree: any, depth = 0, didShift = false) {
        const newDeps: any = {};
        if (depth === 2) {
            for (let row in tree) {
                let tmp = tree[row];
                if (row > pivotRow) {
                    newDeps[parseInt(row) - 1] = tree[row];
                    delete tree[row];
                }
                if (didShift) {
                    for (let col in tmp) {
                        cellsToUpdate[`${row},${col}`] = [row,col];
                    }

                }
            }
        } else if (depth === 0) {
            for (let row in tree) {
                if (row == pivotRow) {
                    helper(tree[row], 1,true);
                    delete tree[row];
                } else if (row > pivotRow) {
                    newDeps[parseInt(row) - 1] = helper(tree[row], 1, true);
                    delete tree[row];
                } else {
                    helper(tree[row], 1);
                }
            }
        } else if (depth === 1) {
            for (let col in tree) {
                helper(tree[col], 2, didShift);
            }
        }
        for (let rowOrCol in newDeps) { // in place update
            tree[rowOrCol] = newDeps[rowOrCol];
        }
        return tree;
    }
    helper(dependencyTree);
    return cellsToUpdate;
}
export function shiftDependenciesDown(pivotRow: any) {
    const cellsToUpdate: any = {};
    function helper(tree: any, depth = 0,didShift=false) {
        const newDeps: any = {};
        if (depth === 2) {
            for (let row in tree) {
                let tmp = tree[row];
                if (row >= pivotRow) {
                    newDeps[parseInt(row) + 1] = tree[row];
                    delete tree[row];
                }
                if (didShift) {
                    for (let col in tmp) {
                        cellsToUpdate[`${row},${col}`] = [row,col];
                    }

                }
            }
        } else if (depth === 0) {
            for (let row in tree) {
                if (row >= pivotRow) {
                    newDeps[parseInt(row) + 1] = helper(tree[row], 1,true);
                    delete tree[row];
                } else {
                    helper(tree[row], 1);
                }
            }
        } else if (depth === 1) {
            for (let col in tree) {
                helper(tree[col], 2,didShift);
            }
        }
        for (let rowOrCol in newDeps) { // in place update
            tree[rowOrCol] = newDeps[rowOrCol];
        }
        return tree;
    }
    helper(dependencyTree);
    return cellsToUpdate;
}
export function shiftDependenciesRight(pivotCol: any) {
    const cellsToUpdate: any = {};
    function helper(tree: any, depth = 0, didshift?: any, _row?: any) {
        const newDeps: any = {};
        if (depth === 0 || depth === 2) {
            for (let row in tree) {
                helper(tree[row], depth + 1, didshift, row);
            }
        }
        else if (depth === 1) {
            for (let col in tree) {
                if (col >= pivotCol) {
                    newDeps[parseInt(col) + 1] = helper(tree[col], 2,true, null);
                    delete tree[col];
                } else {
                    helper(tree[col], 2);
                }
            }
        } else if (depth === 3) {
            for (let col in tree) {
                if (col >= pivotCol) {
                    newDeps[parseInt(col) + 1] = true;
                    delete tree[col];
                }
                if (didshift) {
                    cellsToUpdate[`${_row},${col}`] = [_row,col];
                }
            }
        }
        for (let rowOrCol in newDeps) { // in place update
            tree[rowOrCol] = newDeps[rowOrCol];
        }
        return tree;
    }
    helper(dependencyTree);
    return cellsToUpdate;
}
export function shiftDependenciesLeft(pivotCol: any) {
    const cellsToUpdate: any = {};
    function helper(tree: any, depth = 0, didshift?: any, _row?: any) {
        const newDeps: any = {};
        if (depth === 0 || depth === 2) {
            for (let row in tree) {
                helper(tree[row], depth + 1, didshift, row);
            }
        }
        else if (depth === 1) {
            for (let col in tree) {
                if (col == pivotCol) {
                    helper(tree[col], 2, true);
                    delete tree[col];
                } else if (col >= pivotCol) {
                    newDeps[parseInt(col) - 1] = helper(tree[col], 2,true, null);
                    delete tree[col];
                } else {
                    helper(tree[col], 2);
                }
            }
        } else if (depth === 3) {
            for (let col in tree) {
                if (col >= pivotCol) {
                    newDeps[parseInt(col) - 1] = true;
                    delete tree[col];
                }
                if (didshift) {
                    cellsToUpdate[`${_row},${col}`] = [_row,col];
                }
            }
        }
        for (let rowOrCol in newDeps) { // in place update
            tree[rowOrCol] = newDeps[rowOrCol];
        }
        return tree;
    }
    helper(dependencyTree);
    return cellsToUpdate;
}

export function removeDependents(deptRow:any, deptCol: any) {
    const dependencies = getDependencies(deptRow, deptCol);
    for(const [drow, dcol] of dependencies) {
        const dcell = dependencyTree[drow]?.[dcol];
        if (!dcell) continue;
        if (dcell[deptRow]?.[deptCol]) {
            delete dcell[deptRow][deptCol];
            if (isEmpty(dcell[deptRow])) {
                delete dcell[deptRow];
            }
        }
    }
    removeDependencies(deptRow, deptCol);
}
export function getDependencies(row: number,col: number) {
    const deps = [];
    const t = reverseDependencyTree;
    const cell = t[row]?.[col];
    if (!cell) return [];
    for(let drow in cell) {
        for(let dcol in cell[drow]) {
            deps.push([drow,dcol]);
        }
    }
    return deps;
}
export function removeDependencies(row:any, col:any) {
    const t = reverseDependencyTree;
    if (!t[row]?.[col]) return;
    delete t[row][col];
    if (isEmpty(t[row])) delete t[row];
}