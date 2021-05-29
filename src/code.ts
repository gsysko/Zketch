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
  //TODO: Upload flow as an organization wide font!
  await figma.loadFontAsync({family: "Flow", style: "Circular"}).catch(() => {
    figma.ui.postMessage("missing_font")
  })
  if (msg.type === 'watch') {
    //See if anything is selected.
    let prevSelection = figma.currentPage.selection[0]
    //Loop while the plugin is open.
    while (true) {
      await timer(700)
      //See what is now selected...
      figma.currentPage.selection.forEach(currentSelection => {
        //...and if anything is selected, and it is different than what was previously selected...
        if (currentSelection && currentSelection != prevSelection){
          //TODO Check that blockframing has not already been applied.
          //Register changed selection...
          prevSelection = currentSelection
          //... and sketchify it!
          switch(currentSelection.type) {
            case "INSTANCE": {
              let component = currentSelection as InstanceNode
              if(component.mainComponent.name.endsWith("icon") || (component.mainComponent.parent && component.mainComponent.parent.name.endsWith("icon"))) {
                replaceIcon(component)
              }
              (component.findAll(node => node.type == "TEXT") as TextNode[]).forEach(text => {
                replaceText(text)
              });
              (component.findAll(node => node.type == "INSTANCE" && (node.mainComponent.name.endsWith("icon") || (node.mainComponent.parent && node.mainComponent.parent.name.endsWith("icon")))) as InstanceNode[]).forEach(icon => {
                //TODO: Need to check if already blockframed
                replaceIcon(icon)
              });
              component.setRelaunchData({ open: "" })
              break
            }
            case "TEXT": {
              let component = currentSelection as TextNode
              replaceText(currentSelection)
              break
            }
              //TODO: Replace effects.
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

function replaceText(text: TextNode) {
  let blockFontName: FontName = {family: "Flow", style: "Circular"}
  if((text.fontName as FontName).family !== blockFontName.family) {
    text.fontName = blockFontName
    text.fontSize = text.fontSize as number * 2
    text.letterSpacing = {value: text.fontSize * -.28, unit: (text.letterSpacing as LetterSpacing).unit}
    text.insertCharacters(0, " ")
    text.setRangeLetterSpacing(0, 1, {value: text.letterSpacing.value * 1.6, unit:  (text.letterSpacing as LetterSpacing).unit})
    text.opacity = 0.35
  }
}

async function replaceIcon(icon: InstanceNode) {
  debugger
  if (icon.mainComponent.name.endsWith("26px icon")){
    await figma.importComponentByKeyAsync("d36051d3311eb699032aec760e0b0758e223d698").then(component => {
      icon.swapComponent(component)
    })
  } else if (icon.mainComponent.parent.name.endsWith("12px icon")){
    await figma.importComponentByKeyAsync("fe683a34c123e6be216b2df0dbd1b89256015bea").then(component => {
      icon.swapComponent(component)
    })
  } else if (icon.mainComponent.parent.name.endsWith("16px icon")){
    await figma.importComponentByKeyAsync("d36051d3311eb699032aec760e0b0758e223d698").then(component => {
      icon.swapComponent(component)
    })
  }
  icon.opacity = 0.5
}

