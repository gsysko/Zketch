var messageCount: number = 0
var conversation: FrameNode

// This plugin will open a window to prompt the user to enter a message, and
// it will then create a message symbol with that text on screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__)
figma.ui.resize(400, 100)

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async msg => {
  await figma.loadFontAsync({family: "Flow", style: "Circular"})
  let blockFontName: FontName = {family: "Flow", style: "Circular"}
  if (msg.type === 'watch') {
    //See if anything is selected.
    let prevSelection = figma.currentPage.selection[0]
    //Loop while the plugin is open.
    while (true) {
      await timer(1000)
      //See what is now selected...
      figma.currentPage.selection.forEach(currentSelection => {
        //...and if anything is selected, and it is different than what was previously selected...
        if (currentSelection && currentSelection != prevSelection){
          //Register changed selection...
          console.log(currentSelection);
          prevSelection = currentSelection
          //... and sketchify it!
          switch(currentSelection.type) {
            case "INSTANCE": {
              let component = currentSelection as InstanceNode
              (component.findAll(node => node.type == "TEXT") as TextNode[]).forEach(text => {
                //TODO: Need to check if already blockframed
                text.fontName = blockFontName
                text.fontSize = text.fontSize as number * 2
                text.letterSpacing = {value: (text.letterSpacing as LetterSpacing).value * 44.33, unit: (text.letterSpacing as LetterSpacing).unit}
                text.opacity = 0.35
              })
              //TODO: also care for text layers etc.
            }
          }
        } else {
          // console.log(currentSelection)
        }
      })
    }
  }
}

function timer(ms) { return new Promise(res => setTimeout(res, ms)); }

//Used to clone fills, etc. so they can be set.
function clone(val) {
  const type = typeof val
  if (val === null) {
    return null
  } else if (type === 'undefined' || type === 'number' ||
             type === 'string' || type === 'boolean') {
    return val
  } else if (type === 'object') {
    if (val instanceof Array) {
      return val.map(x => clone(x))
    } else if (val instanceof Uint8Array) {
      return new Uint8Array(val)
    } else {
      let o = {}
      for (const key in val) {
        o[key] = clone(val[key])
      }
      return o
    }
  }
  throw 'unknown'
}
