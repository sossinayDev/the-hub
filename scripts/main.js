const availableFonts = [
    "Abril Fatface",
    "Alata",
    "Allison",
    "Amatic SC",
    "Anton",
    "Audiowide",
    "Big Shoulders Display",
    "Black Ops One",
    "Bokor",
    "Bungee Shade",
    "Chakra Petch",
    "Cormorant Garamond",
    "Doto",
    "Edu AU VIC WA NT Pre",
    "Exo",
    "Faculty Glyphic",
    "Fredericka the Great",
    "Ga Maamli",
    "Give You Glory",
    "Jacquard 24",
    "Jacquarda Bastarda 9",
    "Jaro",
    "Lacquer",
    "Lilita One",
    "Matemasie",
    "Monoton",
    "Mrs Saint Delafield",
    "Orbitron",
    "Permanent Marker",
    "Press Start 2P",
    "Protest Revolution",
    "Rock Salt",
    "Rowdies",
    "Rubik Mono One",
    "Rye",
    "Sarina",
    "Shadows Into Light",
    "Silkscreen",
    "Sixtyfour",
    "Sour Gummy",
    "Turret Road",
    "Ubuntu",
    "Arial",
    "Arial Black",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Lucida Console",
    "Helvetica",
    "Comic Sans MS"
]







let profiles = [
    { id: 1, background: 2, widgets: { small: [], medium: [], big: [] }, settings: { dark_mode: true } },
    { id: 2, background: 4, widgets: { small: [], medium: [], big: [] }, settings: { dark_mode: false } },
    { id: 3, background: 8, widgets: { small: [], medium: [], big: [] }, settings: { dark_mode: true } }
];

let activeProfile = localStorage.getItem("current_profile");
let edit_widgets = false;
activeProfile = parseInt(activeProfile)
if (activeProfile === null) {
    activeProfile = 1;
    localStorage.setItem("current_profile", 1)
}



function changeBackground(profileId) {
    const body = document.body;
    const profile = profiles.find(p => p.id === profileId);

    if (profile) {
        const backgroundImage = `../assets/default_wallpapers/bg_${profile.background}.jpg`;
        body.style.setProperty('--background-image', `url('${backgroundImage}')`);
    }
}

function loadWidgets(profileId) {
    const profile = profiles.find(p => p.id === profileId);

    if (!profile) {
        console.error('Profile not found');
        return
    }

    const widgetTypes = [
        { size: 'small', widgets: profile.widgets.small, barId: 'small_widget_bar', className: 'small_widget' },
        { size: 'medium', widgets: profile.widgets.medium, barId: 'medium_widget_bar', className: 'widget' },
        { size: 'big', widgets: profile.widgets.big, barId: 'big_widget_bar', className: 'big_widget' }
    ];

    widgetTypes.forEach(widgetType => {
        const widgetBar = document.getElementById(widgetType.barId);

        widgetBar.innerHTML = '';

        widgetType.widgets.forEach((widget, index) => {
            const widgetContainer = createWidgetContainer(widgetType.className, widget, widgetType.size, index, widgetBar, profile);
            widgetBar.appendChild(widgetContainer);
        });

        const addButton = document.createElement('button');
        addButton.className = widgetType.className + " add_widget";
        addButton.id = `add_${widgetType.size}_widget`;
        addButton.addEventListener('click', function () {
            widgetmenu(widgetType.size);
        });

        addButton.textContent = '+';
        addButton.style.display = "none"

        widgetBar.appendChild(addButton);
    });
}

function createWidgetContainer(className, widget, size, index, widgetBar, profile) {
    const widgetContainer = document.createElement("div");
    widgetContainer.style.position = "relative";
    widgetContainer.className = `${size}_widget_container`;

    const widgetElement = document.createElement("iframe");
    widgetElement.className = className;
    widgetElement.src = `widgets/${size}/${widget}.html`;

    const overlay = createOverlay(widgetContainer, widgetBar, profile, size, index);

    widgetContainer.appendChild(widgetElement);
    widgetContainer.appendChild(overlay);

    return widgetContainer;
}

function createOverlay(widgetContainer, widgetBar, profile, size, index) {
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = 0;
    overlay.style.display = "none";
    overlay.style.left = 0;
    overlay.style.right = 0;
    overlay.style.bottom = 0;
    overlay.style.backgroundColor = "transparent";
    overlay.style.cursor = "pointer";
    overlay.className = "widget_removal_overlay"

    overlay.addEventListener('click', function () {
        if (edit_widgets) {

            profile.widgets[size].splice(index, 1);
            saveProfiles()
            loadWidgets(activeProfile)
            start_widget_editing()
        }
    });

    return overlay;
}

function stop_widget_editing() {
    edit_widgets = false;
    document.getElementById("edit_indicator").style.display = "none"
    let overlays = document.querySelectorAll(".widget_removal_overlay")
    if (overlays) {
        overlays.forEach(overlay_elem => {
            overlay_elem.style.display = "none"
        });
    }
    let add_buttons = document.querySelectorAll(".add_widget")
    if (add_buttons) {
        add_buttons.forEach(btn => {
            btn.style.display = "none"
        });
    }
    let menus = document.querySelectorAll(".menu")
    menus.forEach(menu => {
        menu.style.display = "none"
    });
}

function start_widget_editing() {
    edit_widgets = true;
    document.getElementById("edit_indicator").style.display = "block"
    let overlays = document.querySelectorAll(".widget_removal_overlay")
    if (overlays) {
        overlays.forEach(overlay_elem => {
            overlay_elem.style.display = "block"
        });
    }
    let add_buttons = document.querySelectorAll(".add_widget")
    if (add_buttons) {
        add_buttons.forEach(btn => {
            btn.style.display = "block"
        });
    }
}

function switchProfile(profileId) {
    activeProfile = profileId;
    localStorage.setItem("current_profile", profileId)
    saveProfiles();
    stop_widget_editing();
    changeBackground(profileId);
    loadWidgets(profileId);
    if (settingsOpen) {
        toggleSettings()
    }
    load_settings()
}

function saveProfiles() {
    localStorage.setItem('profiles', JSON.stringify(profiles));
}

function loadProfiles() {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
        profiles = JSON.parse(savedProfiles);
    }
    changeBackground(activeProfile);
    loadWidgets(activeProfile)
}

function widgetmenu(size) {
    let menus = document.querySelectorAll(".menu")
    menus.forEach(menu => {
        menu.style.display = "none"
    });
    let obj = document.querySelectorAll("." + size + "_widget_selector")[0]
    obj.style.display = "flex"
    console.log(obj)
}

function next_wallpaper() {
    const profile = profiles.find(p => p.id === activeProfile);
    if (profile) {
        profile.background += 1;
        if (profile.background > amountOfBackgrounds) {
            profile.background = 1;
        }
        changeBackground(activeProfile);
        saveProfiles();
    }
}

function random_wallpaper() {
    const profile = profiles.find(p => p.id === activeProfile);
    if (profile) {
        profile.background = Math.floor(Math.random() * (amountOfBackgrounds - 1)) + 1
        changeBackground(activeProfile);
        saveProfiles();
    }
}

function add_widget(name, size) {
    const profile = profiles.find(p => p.id === activeProfile);
    if (profile) {
        profile.widgets = profile.widgets || { small: [], medium: [], big: [] };
        profile.widgets[size] = profile.widgets[size] || [];

        profile.widgets[size].push(name);
        let obj = document.querySelectorAll("." + size + "_widget_selector")[0]
        obj.style.display = "none"
        loadWidgets(activeProfile);
        start_widget_editing()
        saveProfiles()
    } else {
        console.error("Profile not found for activeProfile:", activeProfile);
    }
}

function add_small_widget(name) {
    add_widget(name, "small");
}

function add_medium_widget(name) {
    add_widget(name, "medium");
}

function add_big_widget(name) {
    add_widget(name, "big");
}

function init() {
    window.onload = function () {
        loadProfiles();
        document.querySelectorAll('.user_selector img').forEach((userImg, index) => {
            userImg.addEventListener('click', () => {
                switchProfile(index + 1);
            });
        });
        document.querySelectorAll('.settings_bar img').forEach((button, index) => {
            if (button.id == "change_wallpaper") {
                button.addEventListener('click', () => {
                    next_wallpaper();
                });
            }
            if (button.id == "random_wallpaper") {
                button.addEventListener('click', () => {
                    random_wallpaper();
                });
            }
            if (button.id == "edit_widgets") {
                button.addEventListener('click', () => {
                    edit_widgets = !edit_widgets;
                    if (edit_widgets) {
                        start_widget_editing()
                    }
                    else {
                        stop_widget_editing()
                    }
                });
            }
            if (button.id == "settings") {
                button.addEventListener('click', () => {
                    toggleSettings()
                });
            }
        });
        load_settings()
    };
}

function sendThemeSettings() {
    const iframes = document.querySelectorAll('iframe'); // Select all iframes
    // Loop through all iframes and send dark mode status
    iframes.forEach(iframe => {
        iframe.contentWindow.postMessage({ darkMode: isDarkMode, powerSaver: power_saver, textColor: text_color, fontFamily: font_family, fontWeight: font_weight }, '*');
    });


    const elements = document.querySelectorAll('*'); // Select all iframes
    // Loop through all iframes and send dark mode status
    elements.forEach(element => {
        if (isDarkMode) {
            element.classList.add("dark-mode")
        }
        else {
            element.classList.remove("dark-mode")
        }

        element.style.color = text_color;
        element.style.fontFamily = font_family;
        element.style.fontWeight = font_weight;
    });
}

function toggleSettings() {
    settingsOpen = !settingsOpen
    if (settingsOpen) {
        document.querySelector(".menu-container").style.display = "none"
        document.querySelector(".main_settings").style.display = "block"
    }
    else {
        document.querySelector(".menu-container").style.display = "flex"
        document.querySelector(".main_settings").style.display = "none"
    }
}

function load_settings() {
    const profile = profiles.find(p => p.id === activeProfile);
    if (profile) {
        isDarkMode = profile.settings.dark_mode
        font_family = profile.settings.fontFamily
        font_weight = profile.settings.fontWeight
        text_color = profile.settings.textColor
        power_saver = profile.settings.powerSaver
        document.getElementById("dark_mode_checkbox").checked = isDarkMode
        loadFonts()
    }
    sendThemeSettings()
}



// Function to detect available fonts in the document
async function loadFonts() {

    const fontSelect = document.getElementById('font-select');
    fontSelect.innerHTML = "";
    const weightSelect = document.getElementById('weight-select');
    const sampleText = document.getElementById('sample-text');
    console.log(availableFonts)
    const fontSet = new Set();

    availableFonts.forEach(font => {
        fontSet.add(font); // Add each unique font family
    });

    fontSet.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        option.className = "select_option"
        option.text = font;
        if (font == font_family) {
            option.selected = true
        }
        fontSelect.appendChild(option);
    });
}

// Function to apply selected font and weight to the sample text
function applyFont() {

    const fontSelect = document.getElementById('font-select');
    const weightSelect = document.getElementById('weight-select');

    font_family = fontSelect.value;
    font_weight = weightSelect.value;

    sendThemeSettings()
}

function save_settings() {
    applyFont()
    const profile = profiles.find(p => p.id === activeProfile);

    isDarkMode = document.getElementById("dark_mode_checkbox").checked
    power_saver = document.getElementById("power_saver_checkbox").checked

    if (profile) {
        profile.settings.dark_mode = isDarkMode
        profile.settings.fontFamily = font_family
        profile.settings.fontWeight = font_weight
        profile.settings.textColor = text_color
        profile.settings.powerSaver = power_saver
    }
    saveProfiles()
    sendThemeSettings()
    console.log("Saved settings")
}

let settingsOpen = false
let isDarkMode = false
let font_family = "Poppins"
let font_weight = 300
let text_color = "#ffffff"
let power_saver = true
const amountOfBackgrounds = 10

setTimeout(init, 10)
setTimeout(loadFonts, 1000)
setInterval(sendThemeSettings, 50)