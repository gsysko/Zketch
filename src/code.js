var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var messageCount = 0;
var conversation;
// This plugin will open a window to prompt the user to enter a message, and
// it will then create a message symbol with that text on screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(400, 100);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    //TODO: Upload flow as an organization wide font!
    yield figma.loadFontAsync({ family: "Flow", style: "Circular" }).catch(() => {
        figma.ui.postMessage("missing_font");
    });
    let blockFontName = { family: "Flow", style: "Circular" };
    if (msg.type === 'watch') {
        //See if anything is selected.
        let prevSelection = figma.currentPage.selection[0];
        //Loop while the plugin is open.
        while (true) {
            yield timer(700);
            //See what is now selected...
            figma.currentPage.selection.forEach(currentSelection => {
                //...and if anything is selected, and it is different than what was previously selected...
                if (currentSelection && currentSelection != prevSelection) {
                    //TODO Check that blockframing has not already been applied.
                    //Register changed selection...
                    prevSelection = currentSelection;
                    //... and sketchify it!
                    switch (currentSelection.type) {
                        case "INSTANCE": {
                            let component = currentSelection;
                            if (component.mainComponent.name.endsWith("icon") || (component.mainComponent.parent && component.mainComponent.parent.name.endsWith("icon"))) {
                                replaceIcon(component);
                            }
                            component.findAll(node => node.type == "TEXT").forEach(text => {
                                replaceText(text, blockFontName);
                            });
                            component.findAll(node => node.type == "INSTANCE" && (node.mainComponent.name.endsWith("icon") || (node.mainComponent.parent && node.mainComponent.parent.name.endsWith("icon")))).forEach(icon => {
                                //TODO: Need to check if already blockframed
                                replaceIcon(icon);
                            });
                            break;
                        }
                        case "TEXT": {
                            let component = currentSelection;
                            replaceText(currentSelection, blockFontName);
                            break;
                        }
                        //TODO: also care for text layers etc.
                    }
                }
                else {
                    // console.log(currentSelection)
                }
            });
        }
    }
});
function timer(ms) { return new Promise(res => setTimeout(res, ms)); }
//Used to clone fills, etc. so they can be set.
function clone(val) {
    const type = typeof val;
    if (val === null) {
        return null;
    }
    else if (type === 'undefined' || type === 'number' ||
        type === 'string' || type === 'boolean') {
        return val;
    }
    else if (type === 'object') {
        if (val instanceof Array) {
            return val.map(x => clone(x));
        }
        else if (val instanceof Uint8Array) {
            return new Uint8Array(val);
        }
        else {
            let o = {};
            for (const key in val) {
                o[key] = clone(val[key]);
            }
            return o;
        }
    }
    throw 'unknown';
}
function replaceText(text, blockFontName) {
    if (text.fontName.family !== blockFontName.family) {
        text.fontName = blockFontName;
        text.fontSize = text.fontSize * 2;
        text.letterSpacing = { value: text.letterSpacing.value * 50, unit: text.letterSpacing.unit };
        text.opacity = 0.35;
    }
}
function replaceIcon(icon) {
    return __awaiter(this, void 0, void 0, function* () {
        debugger;
        if (icon.mainComponent.name.endsWith("26px icon")) {
            yield figma.importComponentByKeyAsync("d36051d3311eb699032aec760e0b0758e223d698").then(component => {
                icon.swapComponent(component);
            });
        }
        else if (icon.mainComponent.parent.name.endsWith("12px icon")) {
            yield figma.importComponentByKeyAsync("fe683a34c123e6be216b2df0dbd1b89256015bea").then(component => {
                icon.swapComponent(component);
            });
        }
        else if (icon.mainComponent.parent.name.endsWith("16px icon")) {
            yield figma.importComponentByKeyAsync("d36051d3311eb699032aec760e0b0758e223d698").then(component => {
                icon.swapComponent(component);
            });
        }
        icon.opacity = 0.35;
    });
}
