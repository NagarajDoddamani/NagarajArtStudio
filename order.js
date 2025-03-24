document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("vOClVl_5j0kCXHDYL"); // Replace with your EmailJS User ID

    document.getElementById("orderForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let size = document.getElementById("size").value;
        let details = document.getElementById("details").value;
        let fileInput = document.getElementById("photo");

        if (fileInput.files.length === 0) {
            alert("Please upload an image!");
            return;
        }

        let reader = new FileReader();
        reader.onload = function () {
            let imageBase64 = reader.result.split(",")[1]; // Convert to Base64

            let templateParams = {
                to_email: "nagarajcreations2005@gmail.com", // Your email
                from_name: name,
                user_email: email,
                size: size,
                details: details,
                photo: imageBase64
            };

            emailjs.send("service_3qin3bi", "template_srm3i3h", templateParams)
                .then(response => {
                    alert("Order placed successfully!");
                    document.getElementById("orderForm").reset();
                })
                .catch(error => {
                    alert("Failed to send order. Try again later.");
                    console.error("Email error:", error);
                });
        };

        reader.readAsDataURL(fileInput.files[0]); // Convert image to Base64
    });
});
