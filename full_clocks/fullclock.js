window.addEventListener('message', function (event) {
    if (event.data && typeof event.data.fontWeight !== 'undefined') {
        isDarkMode = event.data.darkMode;
        font_weight = event.data.fontWeight;
        text_color = event.data.textColor;
        font_family = event.data.fontFamily;
    }
});

function update_theme() {
    const elements = document.querySelectorAll('iframe, body, div, p, h1, h2, h3, h4, h5, h6, h7, h8, strong, a, span, html, input, ul');
    elements.forEach(element => {
        element.style.fontFamily = font_family
        element.style.fontWeight = font_weight
        element.style.textColor = text_color
        if (isDarkMode) {
            element.classList.add("dark-mode");
        } else {
            element.classList.remove("dark-mode");
        }
    });
}

let isDarkMode = false
let font_weight = 300
let text_color = "#ffffff"
let font_family = "Poppins"

console.log("Mainclock loaded");
setInterval(update_theme, 10)