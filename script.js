document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    let activeCard = null;
    let currentAudio = null;
    let zoomedImage = null;
    let isCardPlaying = false;

    // Background audio setup
    const backgroundAudio = document.querySelector("#background-video audio");

    if (backgroundAudio) {
        backgroundAudio.volume = 0.5; // Adjust background volume
        // backgroundAudio.currentTime = 30;
        backgroundAudio.play().catch(error => console.error("Error playing background audio:", error));
    }

    // Mapping songs to their specific start times (in seconds)
    const songTimelines = {
        "song1": 30, "song2": 45, "song3": 20, "song4": 35,
        "song5": 50, "song6": 25, "song7": 40, "song8": 15,
        "song9": 55, "song10": 10, "song11": 60, "song12": 5
    };

    // Different neon colors for quote overlays
    const colors = [
        "#ff007f", "#ff1493", "#ff4500", "#ff8c00", "#00ff7f",
        "#1e90ff", "#8a2be2", "#ff6347", "#ffd700", "#dc143c"
    ];

    function playSong(songId) {
        let audio = document.getElementById(songId);

        if (!audio) {
            console.error(`Audio element with ID '${songId}' not found.`);
            return;
        }

        // Stop currently playing song before starting a new one
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Stop background music when playing a song
        if (backgroundAudio) {
            backgroundAudio.pause();
        }

        // Set start time and play the song
        audio.currentTime = songTimelines[songId] || 0;
        audio.play().catch(error => console.error("Error playing audio:", error));

        // Update active audio reference
        currentAudio = audio;
        isCardPlaying = true;

        // Restart background music when song ends
        audio.onended = function () {
            currentAudio = null;
            isCardPlaying = false;
            if (backgroundAudio) {
                backgroundAudio.play();
            }
        };
    }

    function toggleCard(card, songId) {
        if (activeCard === card) {
            // If clicking the same card, pause song & deactivate
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            card.classList.remove("active");
            closeZoom();
            activeCard = null;
            isCardPlaying = false;

            // Resume background music if no card song is playing
            if (backgroundAudio) {
                backgroundAudio.play();
            }
        } else {
            // If another card is active, deactivate it
            if (activeCard) {
                activeCard.classList.remove("active");
            }
            card.classList.add("active");
            playSong(songId);
            activeCard = card;

            zoomImage(card);
        }
    }

    function zoomImage(card) {
        const img = card.querySelector("img");
        const quoteText = card.dataset.quote || "Love You"; // Get quote from data attribute
        const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Select a random neon color

        if (!img) return;

        // Create zoomed image container
        if (!zoomedImage) {
            zoomedImage = document.createElement("div");
            zoomedImage.classList.add("zoomed-container");
            zoomedImage.innerHTML = `
                <img src="${img.src}" class="zoomed-image">
                <div class="quote-overlay" style="text-shadow: 0 0 5px ${randomColor}, 0 0 10px ${randomColor}, 0 0 20px ${randomColor};">
                    "${quoteText}"
                </div>
            `;
            document.body.appendChild(zoomedImage);

            zoomedImage.addEventListener("click", closeZoom);
        } else {
            zoomedImage.querySelector("img").src = img.src;
            zoomedImage.querySelector(".quote-overlay").textContent = `"${quoteText}"`;
            zoomedImage.querySelector(".quote-overlay").style.textShadow =
                `0 0 5px ${randomColor}, 0 0 10px ${randomColor}, 0 0 20px ${randomColor}`;
            zoomedImage.style.display = "flex";
        }
    }

    function closeZoom() {
        if (zoomedImage) {
            zoomedImage.style.display = "none";
        }
    }

    // Handle Card Click
    cards.forEach(card => {
        card.addEventListener("click", function () {
            const songId = this.dataset.song;
            toggleCard(this, songId);
        });

        card.addEventListener("mouseover", function () {
            const songId = this.dataset.song;
            if (!isCardPlaying) {
                playSong(songId);
            }
        });

        card.addEventListener("mouseleave", function () {
            if (currentAudio && !isCardPlaying) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
                if (backgroundAudio) {
                    backgroundAudio.play();
                }
            }
        });
    });

    // Floating Heart Animation
    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤️";
        heart.style.left = Math.random() * 100 + "vw"; // Random X position
        heart.style.animationDuration = Math.random() * 2 + 3 + "s"; // Random speed
        document.getElementById("heart-container").appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    setInterval(createHeart, 300);
});
