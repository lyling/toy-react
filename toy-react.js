const RENDER_TO_DOM = Symbol("render to dom")

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(component) {
        let range = document.createRange();
        range.setStart(this.root, this.root.childNodes.length);
        range.setEnd(this.root, this.root.childNodes.length);
        this.root.appendChild(component.root);

    }

    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);

    }
}

export class Component {
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
    }
    setAttribute(name, value) {
        this.props[name] = value;
    }
    appendChild(component) {
        this.children.push(component);
    }

    [RENDER_TO_DOM](range) {
        this.render()[RENDER_TO_DOM](range);
    }

    // get root() {
    //     if (!this._root) {
    //         this._root = this.render().root;
    //     }

    //     return this._root;
    // }
}

export function createElement(type, attributes, ...children) {

    let e;
    if (typeof type == "string") {
        e = new ElementWrapper(type);//document.createElement(type);
    } else {
        e = new type;
    }

    for (let p in attributes) {
        e.setAttribute(p, attributes[p]);
    }

    let insertChildren = (children) => {
        for (let child of children) {
            if (typeof child === "string") {
                child = new TextWrapper(child); //document.createTextNode(c);
            }

            if ((typeof c === "object") && (c instanceof Array)) {
                insertChildren(child);
            }
            else {
                e.appendChild(child);
            }
        }
    }

    insertChildren(children);

    return e;
}

export function render(component, parentElememnt) {
    // parentElememnt.appendChild(component.root);
    let range = document.createRange();
    range.setStart(parentElememnt, 0);
    range.setEnd(parentElememnt, parentElememnt.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range)
}