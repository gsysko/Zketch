!function(e){var n={};function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:i})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(t.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(i,o,function(n){return e[n]}.bind(null,o));return i},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=6)}({6:function(e,n){var t=this&&this.__awaiter||function(e,n,t,i){return new(t||(t=Promise))((function(o,a){function r(e){try{f(i.next(e))}catch(e){a(e)}}function c(e){try{f(i.throw(e))}catch(e){a(e)}}function f(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(r,c)}f((i=i.apply(e,n||[])).next())}))};function i(e){return new Promise(n=>setTimeout(n,e))}function o(e){let n={family:"Flow",style:"Circular"};e.fontName.family!==n.family&&(e.fontName=n,e.fontSize=2*e.fontSize,e.letterSpacing={value:-.28*e.fontSize,unit:e.letterSpacing.unit},e.insertCharacters(0," "),e.setRangeLetterSpacing(0,1,{value:1.6*e.letterSpacing.value,unit:e.letterSpacing.unit}),e.opacity=.35)}function a(e){return t(this,void 0,void 0,(function*(){e.mainComponent.name.endsWith("26px icon")?yield figma.importComponentByKeyAsync("d36051d3311eb699032aec760e0b0758e223d698").then(n=>{e.swapComponent(n)}):e.mainComponent.parent.name.endsWith("12px icon")?yield figma.importComponentByKeyAsync("fe683a34c123e6be216b2df0dbd1b89256015bea").then(n=>{e.swapComponent(n)}):e.mainComponent.parent.name.endsWith("16px icon")&&(yield figma.importComponentByKeyAsync("d36051d3311eb699032aec760e0b0758e223d698").then(n=>{e.swapComponent(n)})),e.opacity=.5}))}figma.showUI(__html__),figma.ui.resize(400,100),figma.ui.onmessage=e=>t(this,void 0,void 0,(function*(){if(yield figma.loadFontAsync({family:"Flow",style:"Circular"}).catch(()=>{figma.ui.postMessage("missing_font")}),"watch"===e.type){let e=figma.currentPage.selection[0];for(;;)yield i(700),figma.currentPage.selection.forEach(n=>{if(n&&n!=e)switch(e=n,n.type){case"INSTANCE":{let e=n;(e.mainComponent.name.endsWith("icon")||e.mainComponent.parent&&e.mainComponent.parent.name.endsWith("icon"))&&a(e),e.findAll(e=>"TEXT"==e.type).forEach(e=>{o(e)}),e.findAll(e=>"INSTANCE"==e.type&&(e.mainComponent.name.endsWith("icon")||e.mainComponent.parent&&e.mainComponent.parent.name.endsWith("icon"))).forEach(e=>{a(e)});break}case"TEXT":o(n);break}})}}))}});