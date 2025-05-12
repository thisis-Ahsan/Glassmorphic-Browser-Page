const linkForm = document.getElementsByClassName("form-addLink")[0];
const shortcutsContainer = document.getElementsByTagName("ul")[0];
const dialogue = document.getElementsByClassName("dialogue")[0];
const sec1 = document.getElementsByClassName('sec-1')[0];
const sec2 = document.getElementsByClassName("sec-2")[0];
const searchform = document.getElementsByClassName("search-form")[0];
const searchbar = document.getElementsByClassName("search-bar")[0];

const LOCAL_STORAGE_KEY = "shortcuts";

dialogue.style.display = "none";

document.getElementById("add-btn").addEventListener("click", () => {
    dialogue.style.display = "flex";
    sec1.style.visibility = "hidden";
    sec2.style.visibility = "hidden";
});

document.getElementById("close-btn").addEventListener("click", () => {
    dialogue.style.display = "none";
    sec1.style.visibility = "visible";
    sec2.style.visibility = "visible";
});

// Load saved shortcuts on page load
document.addEventListener("DOMContentLoaded", () => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    saved.forEach(addShortcutToDOM);
});

linkForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const url = document.getElementById("url").value.trim();

    if (!name || !url) return;

    const shortcut = { name, url };
    addShortcutToDOM(shortcut);

    const shortcuts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    shortcuts.push(shortcut);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shortcuts));

    // Reset form and hide dialog
    document.getElementById("name").value = "";
    document.getElementById("url").value = "";
    dialogue.style.display = "none";
    sec1.style.visibility = "visible";
    sec2.style.visibility = "visible";
});

function addShortcutToDOM({ name, url }) {
    const domain = new URL(url).hostname.replace(/^www\./i, "").toLowerCase();

    const li = document.createElement("li");
    li.innerHTML = `
        <a href="${url}" target="_parent" rel="noopener noreferrer">
            <span class="close" data-domain="${domain}">
                <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem"
                    fill="#FFFFFF">
                    <path
                        d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
            </span>
            <img src="https://icons.duckduckgo.com/ip3/${domain}.ico" width="50" height="50" alt="${name}" />
            <h6>${name}</h6>
        </a>
    `;

    const addButtonLi = document.getElementById("add-btn").closest("li");
    shortcutsContainer.insertBefore(li, addButtonLi);

    // Add event listener to close button
    const closeBtn = li.querySelector(".close");
    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        deleteShortcut(domain, li);
    });
}

function deleteShortcut(domain, liElement) {
    // Remove from DOM
    liElement.remove();

    // Remove from localStorage
    const shortcuts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const updated = shortcuts.filter(sc => {
        const shortcutDomain = new URL(sc.url).hostname.replace(/^www\./, "");
        return shortcutDomain !== domain;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchbar.value.trim();
    searchbar.value = ""; // Clear the search bar
    if (query) {
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.location.href = googleUrl;
    }
});