const TYPE_KEYS = {
    container: [],
    text: ["text", "style"],
    sprite: ["texture"]
}

const ALL_KEYS = ["x", "y", "width", "height", "scaleX", "scaleY", "rotation"];

export const filterPropChanges = (testElement, type, oldProps, newProps, hostContext) => {
    
    const keysToCheck = ALL_KEYS.concat(TYPE_KEYS[type]);

    const keysToChange =  Object.keys(newProps).filter(key => keysToCheck.indexOf(key) !== -1);

    if(keysToChange.length) {
        const retObj = {};
        keysToChange.forEach(key => {
            retObj[key] = newProps[key]
        });
        return retObj;
    }

    return false;
}