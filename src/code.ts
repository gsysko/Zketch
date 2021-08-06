const STYLE_ID_MODAL : string = "S:81b110b885888cb981a62e92e5f3dc6e29353b7a,169:1"
const STYLE_ID_MENU : string = "S:20b0405ad7024a20ad878b90b3b75bd5bb26443a,250:3"
const STYLE_ID_TOOLTIP : string = "S:04599336e00832bfa0541e1b3d136384d1ddafdd,133:1"

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
  await figma.loadFontAsync({family: "Flow", style: "Circular"}).catch(() => {
    figma.ui.postMessage("missing_font")
  })
  if (msg.type === 'watch') {
    let prevSelection
    //Loop while the plugin is open.
    while (true) {
      await timer(700)
      //See what is now selected...
      figma.currentPage.selection.forEach(currentSelection => {
        //...and if anything is selected, and it is different than what was previously selected...
        if (currentSelection && currentSelection != prevSelection){
          //Register changed selection...
          prevSelection = currentSelection
          //... and sketchify it!
          switch(currentSelection.type) {
            case "INSTANCE":
            case "FRAME":
            case "GROUP": {
              let selectedNodes : SceneNode[] = currentSelection.findAll()
              selectedNodes.push(currentSelection)
              try {
                (selectedNodes.filter(node => node.type == "TEXT") as TextNode[]).forEach(text => {
                  replaceText(text)
                });
                (selectedNodes.filter(node => node.type == "INSTANCE" && (node.mainComponent.name.endsWith("icon") || (node.mainComponent.parent && node.mainComponent.parent.name.endsWith("icon")))) as InstanceNode[]).forEach(icon => {
                  replaceIcon(icon)
                });
                selectedNodes.filter(node => "effectStyleId" in node && node.effectStyleId != "").forEach( shadyNode => {
                  replaceShadow(shadyNode)
                });
              } catch (error) {
                console.log(error)
              }
              break
            }
            case "TEXT": {
              replaceText(currentSelection)
              break
            }
          }
          currentSelection.setRelaunchData({ open: "" })
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
    text.opacity = 0.35
    if ((text.lineHeight as LineHeight).unit == "PIXELS" && (text.lineHeight as LineHeight)["value"] == text.height) {
      text.insertCharacters(0, " ")
      text.setRangeLetterSpacing(0, 1, {value: text.letterSpacing.value * 1.6, unit:  (text.letterSpacing as LetterSpacing).unit})
    }
  }
}

async function replaceIcon(icon: InstanceNode) {
  if (icon.getPluginData("isZketched") != "true"){
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
    icon.setPluginData("isZketched", "true")
  }
}

function replaceShadow(node: SceneNode) {
  if ("effectStyleId" in node) {
    switch(node.effectStyleId) {
      case STYLE_ID_MODAL: {
        node.effectStyleId = ""
        node.effects = [{"type":"DROP_SHADOW","color":{"r":0.18431372940540314,"g":0.2235294133424759,"b":0.2549019753932953,"a":0.3499999940395355},"offset":{"x":-20,"y":20},"radius":0,"spread":0,"visible":true,"blendMode":"NORMAL"}]
        break
      }
      case STYLE_ID_MENU: {
        node.effectStyleId = ""
        node.effects = [{"type":"DROP_SHADOW","color":{"r":0.01568627543747425,"g":0.2666666805744171,"b":0.3019607961177826,"a":0.15000000596046448},"offset":{"x":-10,"y":10},"radius":0,"spread":0,"visible":true,"blendMode":"NORMAL"}]
        break
      }
      case STYLE_ID_TOOLTIP: {
        node.effectStyleId = ""
        node.effects = [{"type":"DROP_SHADOW","color":{"r":0.01568627543747425,"g":0.2666666805744171,"b":0.3019607961177826,"a":0.15000000596046448},"offset":{"x":-4,"y":4},"radius":0,"spread":0,"visible":true,"blendMode":"NORMAL"}]
        break
      }
    }
  }
}

