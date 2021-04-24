import './ui.css'

window.onload = function() {
  parent.postMessage({ pluginMessage: { type: 'watch'} }, '*');
};