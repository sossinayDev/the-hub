window.addEventListener('message', function (event) {
  if (event.data && typeof event.data.darkMode !== 'undefined') {
    isDarkMode = event.data.darkMode;
  }
});

function update_theme(){
    const elements = document.querySelectorAll('iframe, body, div, p, h1, h2, h3, h4, h5, h6, h7, h8, strong, a, span, html, input, ul');
    elements.forEach(element => {
      if (isDarkMode) {
        element.classList.add("dark-mode");
      } else {
        element.classList.remove("dark-mode");
      }
    });
}

let isDarkMode = false
console.log("Widget loaded");
setInterval(update_theme, 10)