import './ui.css'

window.onload = function() {
  parent.postMessage({ pluginMessage: { type: 'watch'} }, '*');
};

onmessage = (event) => {
  if (event.data.pluginMessage == "missing_font"){
    let span = document.getElementsByTagName('span')[0] as HTMLSpanElement
    span.innerHTML = "Zketchy requires the 'Flow' font. Download it <a href='https://danross.co/flow/#' target='_blank'>here</a>."
  }
}