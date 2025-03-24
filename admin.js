const API_KEY = "AIzaSyB3JpmSTI-c6wA6h91W8DRmAVxekZBdZV0";
const CLIENT_ID = "368831812026-65stgl5cofnttak81eb4suadql3emfg6.apps.googleusercontent.com";
const FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID"; // Replace with actual folder ID

// Admin login credentials (hardcoded)
const validUsers = [
    { username: "admin1", password: "password123" },
    { username: "admin2", password: "securepass" },
    { username: "admin3", password: "admin@321" }
];

// Handle Admin Login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const isValidUser = validUsers.some(user => user.username === username && user.password === password);
    
    if (isValidUser) {
        alert("Login successful! Welcome " + username);
        document.querySelector(".login-form").style.display = "none";
        document.querySelector(".upload-art").style.display = "block";
    } else {
        alert("Invalid Credentials! Please try again.");
    }
});

// Google API Authentication
function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/drive.file" })
        .then(() => console.log("Sign-in successful"))
        .catch(err => console.error("Error signing in", err));
}

function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v3/rest")
        .then(() => console.log("GAPI client loaded for API"))
        .catch(err => console.error("Error loading GAPI client", err));
}

// Upload Artwork to Google Drive
function uploadFile(file, metadata) {
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&key=${API_KEY}`, {
        method: "POST",
        headers: new Headers({ "Authorization": `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}` }),
        body: form
    })
    .then(response => response.json())
    .then(data => {
        alert("Upload successful! File ID: " + data.id);
    })
    .catch(error => console.error("Error uploading file:", error));
}

// Handle File Upload
document.getElementById("uploadForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const file = document.getElementById("artUpload").files[0];
    if (!file) {
        alert("Please select a file!");
        return;
    }
    const metadata = {
        name: file.name,
        parents: [FOLDER_ID],
        mimeType: file.type
    };
    uploadFile(file, metadata);
});

// Initialize Google API Client
gapi.load("client:auth2", () => {
    gapi.auth2.init({ client_id: CLIENT_ID });
});
