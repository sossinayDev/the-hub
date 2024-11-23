
let profiles = [
    { id: 1, background: 2, widgets: { small: [], medium: [], big: [] } },
    { id: 2, background: 4, widgets: { small: [], medium: [], big: [] } },
    { id: 3, background: 8, widgets: { small: [], medium: [], big: [] } }
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
        if (profile.background > 10) {
            profile.background = 1;
        }
        changeBackground(activeProfile);
        saveProfiles();
    }
}

function random_wallpaper() {
    const profile = profiles.find(p => p.id === activeProfile);
    if (profile) {
        profile.background = Math.floor(Math.random() * 9) + 1
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
        });
    };
}

setTimeout(init, 1)