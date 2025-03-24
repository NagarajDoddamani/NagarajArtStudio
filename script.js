const API_KEY = "AIzaSyB3JpmSTI-c6wA6h91W8DRmAVxekZBdZV0";
const FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID"; // Replace with actual folder ID

// Fetch Artworks from Google Drive
async function fetchArtworks() {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,webViewLink,webContentLink)`);
    const data = await response.json();
    const gallery = document.getElementById("gallery");

    data.files.forEach(file => {
        if (file.mimeType.startsWith("image/")) {
            const artItem = document.createElement("div");
            artItem.classList.add("art-item");
            artItem.setAttribute("data-id", file.id); // Store File ID

            artItem.innerHTML = `
                <img src="${file.webContentLink}" alt="${file.name}">
                <h3>${file.name}</h3>
                <p><strong>Price:</strong> ₹XXXX</p>
                <p><strong>Size:</strong> A4</p>
                <p><strong>Medium:</strong> Graphite on Paper</p>
                <button class="like-btn" onclick="likeArtwork(this)">❤️ Like <span>0</span></button>
                <p class="like-message"></p>
            `;

            gallery.appendChild(artItem);
        }
    });

    loadLikes(); // Load stored likes after artworks are displayed
}

// Load stored likes from localStorage
function loadLikes() {
    setTimeout(() => {
        document.querySelectorAll(".art-item").forEach(artwork => {
            let fileId = artwork.getAttribute("data-id"); // Get unique file ID from Drive
            let likeCount = localStorage.getItem(`likes-${fileId}`) || 0;
            let button = artwork.querySelector(".like-btn");
            let countSpan = button.querySelector("span");

            countSpan.innerText = likeCount; // Set saved likes
        });
    }, 1000);
}

// Like button functionality
function likeArtwork(button) {
    let artwork = button.closest(".art-item");
    let fileId = artwork.getAttribute("data-id"); // Use file ID as unique key
    let likeCount = button.querySelector("span");
    let currentLikes = parseInt(likeCount.innerText);
    let message = button.nextElementSibling; // Message below the button

    if (!button.classList.contains("liked")) {
        currentLikes += 1;
        localStorage.setItem(`likes-${fileId}`, currentLikes); // Save with file ID
        likeCount.innerText = currentLikes;
        button.classList.add("liked");
        message.innerText = "You have liked this artwork! ❤️";
        message.style.color = "green";
    } else {
        message.innerText = "You have already liked this artwork!";
        message.style.color = "red";

        setTimeout(() => {
            message.innerText = "";
        }, 3000);
    }
}

// Load artworks when the page loads
document.addEventListener("DOMContentLoaded", fetchArtworks);
