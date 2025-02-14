// Sound effects and Music Player
const sounds = {
    pop: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3')
};

// Music playlist with direct URLs
const musicPlaylist = [
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/Bill%20Withers%20-%20Just%20The%20Two%20Of%20Us.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/Joji%20-%20Glimpse%20of%20Us.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/Joji%20-%20Like%20You%20Do.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/Lady%20Gaga%2C%20Bruno%20Mars%20-%20Die%20With%20A%20Smile.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/Rex%20Orange%20County%20-%20Loving%20is%20Easy.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/SZA%20-%20Snooze.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/SZA%20-%20The%20Weekend.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/Stephen%20Sanchez%20-%20Until%20I%20Found%20You.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/The%20Weeknd%20-%20Die%20For%20You.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/d4vd%20-%20Here%20With%20Me.mp3",
    "https://dl.dropboxusercontent.com/scl/fi/your-file-id/d4vd%20-%20Romantic%20Homicide.mp3"
];

let currentMusicIndex = 0;
let currentMusic = null;
let isMusicPlaying = false;

// Function to get song name from URL
function getSongName(url) {
    return decodeURIComponent(url.split('/').pop().replace('.mp3', ''));
}

// Function to update the current song display
function updateCurrentSongDisplay() {
    const songName = getSongName(musicPlaylist[currentMusicIndex]);
    document.getElementById('currentSong').textContent = songName;
}

// Function to update progress bar
function updateProgressBar() {
    if (currentMusic && !currentMusic.paused) {
        const progress = (currentMusic.currentTime / currentMusic.duration) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        requestAnimationFrame(updateProgressBar);
    }
}

// Function to play a song
function playSong() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic = null;
    }

    const song = musicPlaylist[currentMusicIndex];
    console.log('Attempting to play:', song);

    currentMusic = new Audio(song);
    
    currentMusic.addEventListener('loadeddata', () => {
        currentMusic.play()
            .then(() => {
                isMusicPlaying = true;
                document.getElementById('playBtn').textContent = '⏸️';
                updateCurrentSongDisplay();
                updateProgressBar();
            })
            .catch(error => {
                console.error('Error playing song:', error);
                setTimeout(playNextSong, 2000);
            });
    });

    currentMusic.addEventListener('error', () => {
        console.error('Error loading song:', song);
        setTimeout(playNextSong, 2000);
    });

    currentMusic.addEventListener('ended', playNextSong);
}

// Initialize music player
function initMusicPlayer() {
    const musicControls = document.createElement('div');
    musicControls.className = 'music-controls';
    musicControls.innerHTML = `
        <div class="music-info">
            <span id="currentSong">Select a song to play</span>
            <div class="music-progress">
                <div class="progress-bar" id="progressBar"></div>
            </div>
            <div class="time-display">
                <span id="currentTime">0:00</span>
                <span id="totalTime">0:00</span>
            </div>
        </div>
        <div class="music-selection">
            <select class="music-dropdown" aria-label="Select song">
                <option value="">Choose a song ♫</option>
                ${musicPlaylist.map((song, index) => `
                    <option value="${index}">${getSongName(song)}</option>
                `).join('')}
            </select>
        </div>
        <div class="music-buttons">
            <button id="prevBtn" class="music-btn">⏮️</button>
            <button id="playBtn" class="music-btn">▶️</button>
            <button id="nextBtn" class="music-btn">⏭️</button>
        </div>
    `;
    
    document.querySelector('.content').prepend(musicControls);
    
    // Event listeners for music controls
    document.getElementById('playBtn').addEventListener('click', toggleMusic);
    document.getElementById('prevBtn').addEventListener('click', playPreviousSong);
    document.getElementById('nextBtn').addEventListener('click', playNextSong);
    
    // Add change listener to dropdown
    const dropdown = document.querySelector('.music-dropdown');
    dropdown.addEventListener('change', () => {
        const selectedIndex = parseInt(dropdown.value);
        if (!isNaN(selectedIndex)) {
            currentMusicIndex = selectedIndex;
            playSong();
        }
    });

    // Add progress bar click handler
    const progressBar = document.querySelector('.music-progress');
    progressBar.addEventListener('click', (e) => {
        if (currentMusic) {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            currentMusic.currentTime = currentMusic.duration * percent;
            updateProgressBar();
        }
    });
}

function formatTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function toggleMusic() {
    if (!currentMusic) {
        playSong();
    } else {
        if (isMusicPlaying) {
            currentMusic.pause();
            document.getElementById('playBtn').textContent = '▶️';
        } else {
            currentMusic.play();
            document.getElementById('playBtn').textContent = '⏸️';
        }
        isMusicPlaying = !isMusicPlaying;
    }
    updateCurrentSongDisplay();
}

function playNextSong() {
    currentMusicIndex = (currentMusicIndex + 1) % musicPlaylist.length;
    playSong();
}

function playPreviousSong() {
    currentMusicIndex = (currentMusicIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
    playSong();
}

// Funny Valentine messages template
const funnyMessages = [
    "Hey {name}, I was going to give you my heart… but I lost it in the pizza box!",
    "Roses are red, violets are blue, {name}, I'm terrible at poems but great at loving you!",
    "Dear {name}, you must be a magician because whenever I look at you, everyone else disappears!",
    "Hey {name}, are you a parking ticket? Because you've got FINE written all over you!",
    "To {name}: If you were a vegetable, you'd be a cute-cumber!",
    "{name}, you must be made of copper and tellurium because you're Cu-Te!",
    "Hey {name}, are you a camera? Because every time I look at you, I smile!",
    "Dear {name}, if you were a triangle, you'd be acute one!",
    "{name}, you must be a dictionary because you add meaning to my life!",
    "Hey {name}, are you French? Because Eiffel for you!",
    "To {name}: You must be tired because you've been running through my mind all day!",
    "{name}, if you were a keyboard, you'd be just my type!",
    "Dear {name}, if you were a fruit, you'd be a fine-apple!",
    "{name}, do you like science? Because we've got great chemistry!",
    "Hey {name}, are you a bank loan? Because you've got my interest!",
    "To {name}: You must be a ninja, because you snuck right into my heart!",
    "Dear {name}, are you a campfire? Because you are hot and I want s'more!",
    "{name}, if you were a cat, you'd purr-fect!",
    "Hey {name}, are you WiFi? Because I'm feeling a strong connection!",
    "To {name}: You must be a broom, because you swept me off my feet!",
    "{name}, are you a time traveler? Because I can see you in my future!",
    "Hey {name}, are you made of chocolate? Because you're sweet!",
    "Dear {name}, you must be a snowflake because you're one of a kind!",
    "{name}, if love was a video game, you'd be my player two!",
    "Hey {name}, are you gravity? Because I keep falling for you!",
    "To {name}: You must be a star because you light up my world!",
    "{name}, are you a librarian? Because you've got me checking you out!",
    "Dear {name}, if you were words on a page, you'd be fine print!",
    "Hey {name}, are you a cat? Because you're purr-fect!",
    "{name}, you must be a baker because you're a cutie pie!",
    "To {name}: Are you a parking ticket? Because you've got FINE written all over you!",
    "Dear {name}, you must be a keyboard because you're just my type!",
    "{name}, if you were a vegetable, you'd be a sweet potato!",
    "Hey {name}, are you a campfire? Because you're hot and I want s'more!",
    "To {name}: You must be a magician because whenever I look at you, everyone else disappears!",
    "{name}, are you a bank loan? Because you have my interest!",
    "Dear {name}, if you were a fruit, you'd be a fine-apple!",
    "Hey {name}, are you from Tennessee? Because you're the only ten I see!",
    "{name}, you must be a ninja because you snuck into my heart!",
    "To {name}: Are you a camera? Because every time I see you, I smile!",
    "Dear {name}, you must be tired because you've been running through my mind all day!",
    "{name}, if you were a triangle, you'd be acute one!",
    "Hey {name}, are you made of copper and tellurium? Because you're Cu-Te!",
    "To {name}: You must be a dictionary because you give meaning to my life!",
    "{name}, are you a parking space? Because you're hard to find but worth the search!",
    "Dear {name}, if you were a star, you'd be the brightest one!",
    "Hey {name}, are you a mathematician? Because you add value to my life!",
    "{name}, you must be an artist because you've drawn me to you!",
    "To {name}: Are you a gardener? Because you've planted yourself in my heart!",
    "Dear {name}, you must be a compass because you guide my heart!"
];

// Quiz questions
const quizQuestions = [
    {
        question: "How much do you love chocolate?",
        options: [
            "More than life itself!",
            "It's complicated...",
            "We're just friends",
            "Don't tell anyone, but... a lot!"
        ]
    },
    {
        question: "What's your ideal Valentine's date?",
        options: [
            "Netflix and chill",
            "Adventure time!",
            "Romantic dinner",
            "Surprise me!"
        ]
    },
    {
        question: "What's your favorite romantic movie genre?",
        options: [
            "Rom-Com all the way!",
            "Classic romance",
            "Disney love stories",
            "Anything with a happy ending"
        ]
    },
    {
        question: "Pick your perfect Valentine's gift:",
        options: [
            "Chocolate and flowers",
            "A heartfelt letter",
            "Something handmade",
            "Quality time together"
        ]
    },
    {
        question: "Your ideal romantic setting is:",
        options: [
            "Candlelit dinner",
            "Beach sunset",
            "Cozy movie night",
            "Stargazing adventure"
        ]
    },
    {
        question: "What's your love language?",
        options: [
            "Words of affirmation",
            "Physical touch",
            "Acts of service",
            "Quality time"
        ]
    },
    {
        question: "Choose your perfect love song:",
        options: [
            "Something classic and romantic",
            "A modern pop love song",
            "An acoustic serenade",
            "Whatever makes us dance!"
        ]
    },
    {
        question: "What's your idea of romance?",
        options: [
            "Grand gestures",
            "Small, thoughtful acts",
            "Spontaneous adventures",
            "Quiet moments together"
        ]
    },
    {
        question: "Pick your Valentine's Day color:",
        options: [
            "Classic red",
            "Pretty pink",
            "Pure white",
            "Royal purple"
        ]
    },
    {
        question: "Your perfect Valentine's ending:",
        options: [
            "Watching the sunset",
            "Dancing under the stars",
            "Cuddling at home",
            "Late night desserts"
        ]
    }
];

// Initialize GSAP timeline for the cupid
const cupidTimeline = gsap.timeline({ repeat: -1 });
const cupid = document.getElementById('cupid');
const startX = -100;
const endX = window.innerWidth + 100;

// Cupid animation
function initCupidAnimation() {
    cupidTimeline
        .set(cupid, { x: startX, y: 100 })
        .to(cupid, {
            duration: 10,
            x: endX,
            ease: "none",
            onComplete: () => {
                gsap.set(cupid, { x: startX });
            }
        });
}

// Create floating hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    
    // Adjust heart size based on screen width
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) {
        heart.style.fontSize = '1rem';
    } else if (screenWidth <= 768) {
        heart.style.fontSize = '1.2rem';
    }
    
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    document.querySelector('.hearts-background').appendChild(heart);

    // Make hearts clickable with touch support
    const handleClick = () => {
        heart.classList.add('pop-effect');
        sounds.pop.play();
        setTimeout(() => heart.remove(), 300);
    };
    
    heart.addEventListener('click', handleClick);
    heart.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleClick();
    });

    // Optimize animation performance
    gsap.to(heart, {
        duration: Math.random() * 3 + 2,
        y: -window.innerHeight,
        x: '+=' + (Math.random() * (window.innerWidth < 480 ? 50 : 100) - 25),
        rotation: Math.random() * 360,
        ease: "power1.out",
        onComplete: () => heart.remove()
    });
}

// Adjust heart creation frequency based on device performance
const heartInterval = window.innerWidth <= 480 ? 500 : 300;
setInterval(createHeart, heartInterval);

// Handle surprise button click
let ahlamMessageShown = false;
let samanthaMessageShown = false;
let ibtihalMessageShown = false;
let sophiaMessageShown = false;
let zaydMessageShown = false;
let adamMessageShown = false;
let mouadMessageShown = false;

document.getElementById('surpriseBtn').addEventListener('click', () => {
    const name = document.getElementById('valentineName').value.trim();
    const messageArea = document.getElementById('messageArea');

    // Function to scroll to message
    const scrollToMessage = () => {
        messageArea.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
        });
    };

    // Super Easter egg for Ahlam
    if (name.toLowerCase() === 'ahlam' && !ahlamMessageShown) {
        messageArea.innerHTML = `<div class="special-message super-egg">
            <div class="easter-egg-badge super-badge">✨ Super Easter Egg Unlocked! ✨</div>
            <div class="message-quote super-quote">
                <div class="quote-text">
                    "In a world where respect is earned, not given,
                    <br>you've managed to earn both respect and admiration.
                    <br>Your presence commands attention, your words carry weight,
                    <br>and your actions inspire change.
                    <br>You're not just respected, you're significant."
                </div>
                <div class="quote-author">-With deep respect, Zayd</div>
            </div>
            <div class="floating-hearts-container"></div>
            <div class="sparkle-container"></div>
            <div class="heart-burst">💝</div>
            <div class="respect-badge">Respect Level: Legendary ⭐</div>
        </div>`;
        ahlamMessageShown = true;

        // Create special sparkle effect
        const sparkleContainer = document.querySelector('.sparkle-container');
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'floating-sparkle';
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.animationDuration = `${1.5 + Math.random() * 2}s`;
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
            sparkleContainer.appendChild(sparkle);
        }

        // Create premium hearts background
        const heartsContainer = document.querySelector('.floating-hearts-container');
        const premiumHearts = ['💝', '💖', '💗', '💓', '💕'];
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart premium-heart';
            heart.innerHTML = premiumHearts[Math.floor(Math.random() * premiumHearts.length)];
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${2 + Math.random() * 3}s`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heartsContainer.appendChild(heart);
        }

        // Extra special confetti effect
        const duration = 5000; // Longer duration for super egg
        const animationEnd = Date.now() + duration;

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            confetti({
                particleCount: 4,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: (Math.random() * 0.8)
                },
                colors: ['#FFD700', '#FFA500', '#ff6b6b', '#ff8e8e'],
                shapes: ['star', 'heart'],
                gravity: randomInRange(0.3, 0.5),
                scalar: randomInRange(1, 1.5),
                drift: randomInRange(-0.4, 0.4)
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());
        
        // Scroll to message
        setTimeout(scrollToMessage, 100);
        return;
    }
    
    // Easter egg for Samantha
    if (name.toLowerCase() === 'samantha' && !samanthaMessageShown) {
        messageArea.innerHTML = `<div class="special-message">
            <div class="easter-egg-badge">🎉 You found an easter egg! 🎉</div>
            <div class="message-quote">
                <div class="quote-text">
                    Mouad and Samantha… the couple that proves opposites attract.
                    <br>One is probably chill, the other is probably causing chaos—
                    <br>but together? Somehow, it just works (most of the time).
                </div>
                <div class="quote-divider">• • •</div>
                <div class="quote-text german">
                    Mouad und Samantha… das Paar, das beweist, dass Gegensätze sich anziehen.
                    <br>Einer ist wahrscheinlich entspannt, der andere sorgt wahrscheinlich für Chaos –
                    <br>aber zusammen? Irgendwie funktioniert es (die meiste Zeit).
                </div>
                <div class="quote-author">-Zayd</div>
            </div>
            <div class="floating-hearts-container"></div>
            <div class="heart-burst">💖</div>
        </div>`;
        samanthaMessageShown = true;

        // Create floating hearts background
        const heartsContainer = document.querySelector('.floating-hearts-container');
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '💝';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${2 + Math.random() * 3}s`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heartsContainer.appendChild(heart);
        }

        // Special confetti effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            confetti({
                particleCount: 2,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: (Math.random() * 0.8)
                },
                colors: ['#ff6b6b', '#ff8e8e', '#ffd3d3'],
                shapes: ['heart'],
                gravity: randomInRange(0.4, 0.6),
                scalar: randomInRange(0.8, 1.2),
                drift: randomInRange(-0.4, 0.4)
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());
        
        // Scroll to message
        setTimeout(scrollToMessage, 100);
        return;
    }
    
    // Easter egg for Ibtihal/Btihal
    if ((name.toLowerCase() === 'ibtihal' || name.toLowerCase() === 'btihal') && !ibtihalMessageShown) {
        messageArea.innerHTML = `<div class="special-message">
            <div class="easter-egg-badge">🎉 You found an easter egg! 🎉</div>
            <div class="message-quote">
                <div class="quote-text">
                    Adam & Ibtihal: A love story written in the stars…
                    <br>or at least in my code.
                    <br>May their relationship last longer than Adam's WiFi connection.
                </div>
                <div class="quote-author">-Zayd</div>
            </div>
            <div class="floating-hearts-container"></div>
            <div class="heart-burst">💖</div>
        </div>`;
        ibtihalMessageShown = true;

        // Create floating hearts background
        const heartsContainer = document.querySelector('.floating-hearts-container');
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '💝';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${2 + Math.random() * 3}s`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heartsContainer.appendChild(heart);
        }

        // Special confetti effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            confetti({
                particleCount: 2,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: (Math.random() * 0.8)
                },
                colors: ['#ff6b6b', '#ff8e8e', '#ffd3d3'],
                shapes: ['heart'],
                gravity: randomInRange(0.4, 0.6),
                scalar: randomInRange(0.8, 1.2),
                drift: randomInRange(-0.4, 0.4)
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());
        
        // Scroll to message
        setTimeout(scrollToMessage, 100);
        return;
    }
    
    // Easter egg for Sophia/Sofia/Sofie
    const sophiaVariants = ['sophia', 'sofia', 'sofie','sofie'];
    if (sophiaVariants.includes(name.toLowerCase()) && !sophiaMessageShown) {
        messageArea.innerHTML = `<div class="special-message">
            <div class="easter-egg-badge">🎉 You found an easter egg! 🎉</div>
            <div class="message-quote">
                <div class="quote-text">
                    You typed 'Sophia'? Oh, you must love revisiting history books…
                    <br>because that chapter is closed. Oh, and congrats—you've unlocked 'Pain.exe'…
                    <br>now closing tab. Just kidding.
                    <br>No hard feelings—I still respect her the same way we first met.
                    <br>i do wa79 lah i xoxo
                </div>
                <div class="quote-author">-Zayd</div>
            </div>
            <div class="floating-hearts-container"></div>
            <div class="broken-heart-burst">💔</div>
        </div>`;
        sophiaMessageShown = true;

        // Create broken hearts background
        const heartsContainer = document.querySelector('.floating-hearts-container');
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '💔';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${2 + Math.random() * 3}s`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heartsContainer.appendChild(heart);
        }

        // Special confetti effect with muted colors
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            confetti({
                particleCount: 2,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: (Math.random() * 0.8)
                },
                colors: ['#808080', '#A9A9A9', '#D3D3D3'], // Muted gray colors
                shapes: ['heart'],
                gravity: randomInRange(0.4, 0.6),
                scalar: randomInRange(0.8, 1.2),
                drift: randomInRange(-0.4, 0.4)
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());
        
        // Scroll to message
        setTimeout(scrollToMessage, 100);
        return;
    }
    
    // Easter egg for Adam
    if (name.toLowerCase() === 'adam' && !adamMessageShown) {
        messageArea.innerHTML = `<div class="special-message">
            <div class="easter-egg-badge">🎉 You found an easter egg! 🎉</div>
            <div class="message-quote">
                <div class="quote-text">
                    You typed Adam? Oh, you must be curious about how this 'too-cool-for-love' guy
                    <br>actually managed to get a girlfriend.
                    <br>Must've been all that 'I'm busy' talk—totally irresistible, right?
                </div>
                <div class="quote-author">-Zayd</div>
            </div>
            <div class="floating-hearts-container"></div>
            <div class="heart-burst">💖</div>
            <div class="busy-status">Status: Busy 🚫</div>
        </div>`;
        adamMessageShown = true;

        // Create busy-themed floating hearts
        const heartsContainer = document.querySelector('.floating-hearts-container');
        const busySymbols = ['🚫', '⏰', '📱', '💼', '📅', '✉️', '📞'];
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = busySymbols[Math.floor(Math.random() * busySymbols.length)];
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${2 + Math.random() * 3}s`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heartsContainer.appendChild(heart);
        }

        // Special confetti effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            confetti({
                particleCount: 2,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: (Math.random() * 0.8)
                },
                colors: ['#ff6b6b', '#ff8e8e', '#ffd3d3'],
                shapes: ['heart'],
                gravity: randomInRange(0.4, 0.6),
                scalar: randomInRange(0.8, 1.2),
                drift: randomInRange(-0.4, 0.4)
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());
        
        // Scroll to message
        setTimeout(scrollToMessage, 100);
        return;
    }
    
    // Easter egg for Mouad
    if (name.toLowerCase() === 'mouad' && !mouadMessageShown) {
        messageArea.innerHTML = `<div class="special-message">
            <div class="easter-egg-badge">🎉 You found an easter egg! 🎉</div>
            <div class="message-quote">
                <div class="quote-text english">
                    You typed Mouad? Ah, the guy who thinks he's the 'bad boy' of the family,
                    <br>but secretly spends hours texting his girlfriend.
                    <br>You better watch out, this 'bad boy' might be getting too soft.
                    <br>Who knew the bad brother could get a girl?
                </div>
                <div class="quote-divider">• • •</div>
                <div class="quote-text german">
                    Du hast Mouad getippt? Ah, der Typ, der denkt, er ist der ‚Bad Boy' der Familie,
                    <br>aber heimlich Stunden damit verbringt, seiner Freundin Nachrichten zu schicken.
                    <br>Du solltest vorsichtig sein, dieser ‚Bad Boy' könnte zu weich werden.
                    <br>Wer hätte gedacht, dass der ‚schlechte' Bruder ein Mädchen abkriegen könnte?
                </div>
                <div class="quote-author">-Zayd</div>
            </div>
            <div class="floating-hearts-container"></div>
            <div class="transformation-container">
                <div class="bad-boy-outfit">😎</div>
                <div class="transform-arrow">➡️</div>
                <div class="soft-boy">🥰</div>
            </div>
            <div class="heart-burst">💖</div>
            <div class="bad-boy-badge">Status: Softie in Disguise 😏</div>
        </div>`;
        mouadMessageShown = true;

        // Create transforming floating symbols
        const heartsContainer = document.querySelector('.floating-hearts-container');
        const badBoySymbols = ['😎', '🏍️', '🎸', '🕶️', '🖤'];
        const softSymbols = ['💝', '💌', '🥰', '💕', '💖'];
        
        for (let i = 0; i < 15; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'floating-heart transforming-symbol';
            // Start with bad boy symbol
            symbol.innerHTML = badBoySymbols[Math.floor(Math.random() * badBoySymbols.length)];
            symbol.style.left = `${Math.random() * 100}%`;
            symbol.style.animationDuration = `${2 + Math.random() * 3}s`;
            symbol.style.animationDelay = `${Math.random() * 2}s`;
            
            // Transform to soft symbol after delay
            setTimeout(() => {
                symbol.classList.add('transform-active');
                symbol.innerHTML = softSymbols[Math.floor(Math.random() * softSymbols.length)];
            }, 2000 + Math.random() * 2000);
            
            heartsContainer.appendChild(symbol);
        }

        // Special confetti effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            confetti({
                particleCount: 2,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: (Math.random() * 0.8)
                },
                colors: ['#000000', '#ff69b4', '#363636', '#ff1493'],
                shapes: ['heart'],
                gravity: randomInRange(0.4, 0.6),
                scalar: randomInRange(0.8, 1.2),
                drift: randomInRange(-0.4, 0.4)
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());
        
        // Scroll to message
        setTimeout(scrollToMessage, 100);
        return;
    }
    
    // Ultimate Easter egg for Zayd
    if (name.toLowerCase() === 'zayd' && !zaydMessageShown) {
        messageArea.innerHTML = `<div class="special-message ultimate">
            <div class="easter-egg-badge ultimate-badge">🎉 Ultimate Easter Egg Unlocked! 🎉</div>
            <div class="message-quote ultimate-quote">
                <div class="quote-text">
                    You typed Zayd? Well, congrats on unlocking the most epic prank of all.
                    <br>I've been rejected 8 times in a row, but hey, at least I'm consistent.
                    <br>Oh, and just a heads-up—I still don't have a Valentine this year...
                    <br>but who needs love when you have endless code, right?
                </div>
                <div class="quote-author">-The Forever Alone Coder</div>
            </div>
            <div class="floating-hearts-container"></div>
            <div class="broken-heart-burst">💔</div>
            <div class="coding-symbols">{ } < / > ; #</div>
        </div>`;
        zaydMessageShown = true;

        // Create special coding-themed hearts background
        const heartsContainer = document.querySelector('.floating-hearts-container');
        const symbols = ['💻', '⌨️', '🖥️', '📱', '🤖', '💾', '🔌'];
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart ultimate-heart';
            heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${2 + Math.random() * 3}s`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heartsContainer.appendChild(heart);
        }

        // Extra special confetti effect
        const duration = 5000; // Longer duration for ultimate egg
        const animationEnd = Date.now() + duration;

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            confetti({
                particleCount: 3,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: (Math.random() * 0.8)
                },
                colors: ['#ff6b6b', '#ff8e8e', '#ffd3d3', '#c3c3c3', '#4a4a4a'],
                shapes: ['square', 'circle'],
                gravity: randomInRange(0.3, 0.5),
                scalar: randomInRange(1, 1.5),
                drift: randomInRange(-0.4, 0.4)
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());
        
        // Scroll to message
        setTimeout(scrollToMessage, 100);
        return;
    }
    
    // Regular message handling
    if (name) {
        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        messageArea.innerHTML = `<div class="message">
            <div class="message-quote regular-quote">
                <div class="quote-text">
                    ${randomMessage.replace('{name}', name)}
                </div>
            </div>
        </div>`;
        
        // Trigger confetti
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
        });
        
        // Scroll to regular message
        setTimeout(scrollToMessage, 100);
    }
});

// Mini-games
const games = {
    memoryMatch: {
        name: "Love Memory Match",
        description: "Match the love-themed cards to win!",
        cards: ['❤️', '💖', '💝', '💕', '💗', '💓', '💘', '💞'],
        pairs: [],
        score: 0,
        active: false
    },
    heartCatcher: {
        name: "Heart Catcher",
        description: "Catch falling hearts to score points!",
        score: 0,
        active: false,
        speed: 2,
        hearts: []
    },
    loveQuiz: {
        name: "Love Quiz",
        description: "Test your romantic knowledge!",
        score: 0,
        active: false,
        currentQuestion: 0
    }
};

// Memory Match Game Logic
function startMemoryMatch() {
    games.memoryMatch.active = true;
    games.memoryMatch.score = 0;
    games.memoryMatch.pairs = [];
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';
    
    // Create card pairs
    const cards = [...games.memoryMatch.cards, ...games.memoryMatch.cards];
    shuffleArray(cards);
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.card = card;
        cardElement.dataset.index = index;
        cardElement.innerHTML = '<div class="card-back">?</div><div class="card-front">' + card + '</div>';
        cardElement.addEventListener('click', handleCardClick);
        gameArea.appendChild(cardElement);
    });
}

function handleCardClick(e) {
    if (!games.memoryMatch.active) return;
    
    const card = e.currentTarget;
    if (card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    games.memoryMatch.pairs.push(card);
    
    if (games.memoryMatch.pairs.length === 2) {
        const [card1, card2] = games.memoryMatch.pairs;
        if (card1.dataset.card === card2.dataset.card) {
            games.memoryMatch.score += 10;
            games.memoryMatch.pairs = [];
            sounds.pop.play();
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                games.memoryMatch.pairs = [];
            }, 1000);
        }
    }
}

// Heart Catcher Game Logic
function startHeartCatcher() {
    games.heartCatcher.active = true;
    games.heartCatcher.score = 0;
    games.heartCatcher.hearts = [];
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '<div id="catcher" class="catcher">🤲</div>';
    
    const catcher = document.getElementById('catcher');
    let catcherX = gameArea.offsetWidth / 2;
    
    // Mouse/Touch controls
    gameArea.addEventListener('mousemove', (e) => {
        if (!games.heartCatcher.active) return;
        catcherX = e.clientX - gameArea.offsetLeft;
        catcher.style.left = Math.max(0, Math.min(catcherX, gameArea.offsetWidth - catcher.offsetWidth)) + 'px';
    });
    
    // Game loop
    const gameLoop = setInterval(() => {
        if (!games.heartCatcher.active) {
            clearInterval(gameLoop);
            return;
        }
        
        // Create new hearts
        if (Math.random() < 0.1) {
            const heart = document.createElement('div');
            heart.className = 'falling-heart';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * (gameArea.offsetWidth - 20) + 'px';
            gameArea.appendChild(heart);
            games.heartCatcher.hearts.push(heart);
        }
        
        // Move hearts
        games.heartCatcher.hearts.forEach((heart, index) => {
            const top = parseFloat(heart.style.top || 0);
            if (top > gameArea.offsetHeight) {
                heart.remove();
                games.heartCatcher.hearts.splice(index, 1);
            } else {
                heart.style.top = (top + games.heartCatcher.speed) + 'px';
                
                // Check collision with catcher
                const heartRect = heart.getBoundingClientRect();
                const catcherRect = catcher.getBoundingClientRect();
                
                if (heartRect.bottom >= catcherRect.top &&
                    heartRect.top <= catcherRect.bottom &&
                    heartRect.right >= catcherRect.left &&
                    heartRect.left <= catcherRect.right) {
                    heart.remove();
                    games.heartCatcher.hearts.splice(index, 1);
                    games.heartCatcher.score += 1;
                    sounds.pop.play();
                }
            }
        });
    }, 50);
}

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Mini-game functionality
let gameActive = false;
let score = 0;
const player = document.getElementById('player');
const gameSection = document.getElementById('gameSection');

document.getElementById('startGame').addEventListener('click', () => {
    const gameSection = document.getElementById('gameSection');
    const quizSection = document.getElementById('quizSection');
    
    if (gameSection.style.display === 'none') {
        gameSection.style.display = 'block';
        quizSection.style.display = 'none'; // Hide quiz section if visible
        
        // Reset and initialize game state
        score = 0;
        document.getElementById('score').textContent = 'Score: 0';
        gameActive = true;
        
        // Position player at center bottom
        const gameContainer = document.querySelector('.game-container');
        const player = document.getElementById('player');
        player.style.left = (gameContainer.offsetWidth / 2 - player.offsetWidth / 2) + 'px';
        
        // Start the game
        startGame();
    } else {
        gameSection.style.display = 'none';
        // Reset game state when hiding
        gameActive = false;
        score = 0;
        document.getElementById('score').textContent = 'Score: 0';
        
        // Clear any remaining hearts
        const gameContainer = document.querySelector('.game-container');
        const hearts = gameContainer.querySelectorAll('.falling-heart');
        hearts.forEach(heart => heart.remove());
    }
});

function startGame() {
    if (!gameActive) return;

    const gameContainer = document.querySelector('.game-container');
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * (gameContainer.offsetWidth - 30) + 'px';
    heart.style.top = '0px'; // Start from top
    gameContainer.appendChild(heart);

    // Animate heart falling
    let position = 0;
    const fallSpeed = 2;
    const fallInterval = setInterval(() => {
        if (!gameActive || !heart.parentElement) {
            clearInterval(fallInterval);
            return;
        }
        position += fallSpeed;
        heart.style.top = position + 'px';
        
        // Remove heart if it reaches bottom
        if (position > gameContainer.offsetHeight) {
            heart.remove();
            clearInterval(fallInterval);
        }
    }, 16);

    heart.addEventListener('click', () => {
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
        heart.remove();
        clearInterval(fallInterval);
        sounds.pop.play();

        // Add score animation
        const scorePopup = document.createElement('div');
        scorePopup.className = 'score-popup';
        scorePopup.textContent = '+1';
        scorePopup.style.left = heart.style.left;
        scorePopup.style.top = heart.style.top;
        gameContainer.appendChild(scorePopup);
        setTimeout(() => scorePopup.remove(), 1000);
    });

    // Continue spawning hearts while game is active
    if (gameActive) {
        setTimeout(startGame, Math.random() * 1000 + 500);
    }
}

// Handle player movement with keyboard
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    
    const player = document.getElementById('player');
    const gameContainer = document.querySelector('.game-container');
    const step = 10;
    const currentLeft = parseInt(player.style.left) || 0;
    
    if (e.key === 'ArrowLeft' && currentLeft > 0) {
        player.style.left = Math.max(0, currentLeft - step) + 'px';
    } else if (e.key === 'ArrowRight' && currentLeft < gameContainer.offsetWidth - player.offsetWidth) {
        player.style.left = Math.min(gameContainer.offsetWidth - player.offsetWidth, currentLeft + step) + 'px';
    }
});

// Quiz functionality
let currentQuestion = 0;
const quizSection = document.getElementById('quizSection');

document.getElementById('startQuiz').addEventListener('click', () => {
    const quizSection = document.getElementById('quizSection');
    const gameSection = document.getElementById('gameSection');
    
    if (quizSection.style.display === 'none') {
        quizSection.style.display = 'block';
        gameSection.style.display = 'none'; // Hide game section if visible
        currentQuestion = 0;
        showQuestion(currentQuestion);
    } else {
        quizSection.style.display = 'none';
        // Reset quiz state when hiding
        currentQuestion = 0;
        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = '';
    }
});

function showQuestion(index) {
    if (index >= quizQuestions.length) {
        // Quiz completed
        document.getElementById('quizQuestion').textContent = "Thanks for playing! You're amazing! 💖";
        document.getElementById('quizOptions').innerHTML = `
            <button class="quiz-option restart-quiz">Play Again!</button>
        `;
        document.querySelector('.restart-quiz').addEventListener('click', () => {
            currentQuestion = 0;
            showQuestion(0);
        });
        return;
    }

    const question = quizQuestions[index];
    document.getElementById('quizQuestion').textContent = question.question;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        
        button.addEventListener('click', () => {
            sounds.pop.play();
            
            // Add selection animation
            button.classList.add('selected');
            
            setTimeout(() => {
                currentQuestion++;
                showQuestion(currentQuestion);
            }, 500);
        });
        
        optionsContainer.appendChild(button);
    });
}

// Touch event handling for mobile devices
if ('ontouchstart' in window) {
    const player = document.getElementById('player');
    let touchStartX;
    
    player.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        e.preventDefault();
    }, { passive: false });
    
    player.addEventListener('touchmove', (e) => {
        if (!gameActive) return;
        
        const touch = e.touches[0];
        const gameContainer = document.querySelector('.game-container');
        const containerRect = gameContainer.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        
        let newX = touch.clientX - containerRect.left - (playerRect.width / 2);
        newX = Math.max(0, Math.min(newX, containerRect.width - playerRect.width));
        
        player.style.left = `${newX}px`;
        e.preventDefault();
    }, { passive: false });
}

// Initialize animations
initCupidAnimation();

// Handle window resize events
window.addEventListener('resize', () => {
    cupidTimeline.kill();
    initCupidAnimation();
    updateGameDimensions();
});

// Handle device orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        updateGameDimensions();
        if (gameActive) {
            // Reset game container size
            const gameContainer = document.querySelector('.game-container');
            gameContainer.style.height = window.innerHeight * 0.4 + 'px';
        }
    }, 100);
});

// Responsive handling for game
function updateGameDimensions() {
    if (gameActive) {
        const gameContainer = document.querySelector('.game-container');
        const containerWidth = gameContainer.offsetWidth;
        const containerHeight = gameContainer.offsetHeight;
        
        // Update player position constraints
        const playerElement = document.getElementById('player');
        const playerRect = playerElement.getBoundingClientRect();
        const maxX = containerWidth - playerRect.width;
        
        // Ensure player stays within bounds
        const currentX = parseInt(playerElement.style.left) || containerWidth / 2;
        playerElement.style.left = Math.min(Math.max(0, currentX), maxX) + 'px';
    }
}

// Initialize the page
window.addEventListener('load', () => {
    initCupidAnimation();
    updateGameDimensions();
    initMusicPlayer();
    
    // Ensure sections are hidden initially
    document.getElementById('gameSection').style.display = 'none';
    document.getElementById('quizSection').style.display = 'none';
    
    // Add window resize handler
    window.addEventListener('resize', updateGameDimensions);
});

// Handle window resize
window.addEventListener('resize', updateGameDimensions);

// Update the CSS styles
const style = document.createElement('style');
style.textContent = `
    .special-message {
        position: relative;
        color: #ff6b6b;
        text-align: center;
        padding: 20px;
        overflow: hidden;
    }
    
    .easter-egg-badge {
        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.9em;
        display: inline-block;
        margin-bottom: 20px;
        animation: badgePop 0.5s ease forwards;
        transform: scale(0);
        position: relative;
        z-index: 2;
    }

    .message-quote {
        background: rgba(255, 107, 107, 0.1);
        border-radius: 15px;
        padding: 25px;
        margin: 15px auto;
        max-width: 600px;
        opacity: 0;
        animation: fadeIn 1s ease forwards 0.3s;
        border-left: 4px solid #ff6b6b;
        position: relative;
        z-index: 2;
    }

    .regular-quote {
        border-left-color: #ff8e8e;
        animation: fadeIn 0.5s ease forwards;
        opacity: 1;
    }

    .quote-text {
        font-size: 1.2em;
        line-height: 1.6;
        margin-bottom: 15px;
        color: #ff6b6b;
        font-style: italic;
    }

    .regular-quote .quote-text {
        margin-bottom: 0;
        color: #ff8e8e;
    }

    .quote-author {
        font-size: 1.1em;
        text-align: right;
        color: #ff8e8e;
        font-weight: bold;
        margin-top: 10px;
    }

    .floating-hearts-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }
    
    .floating-heart {
        position: absolute;
        font-size: 1.2em;
        animation: floatHeart 3s ease-in-out infinite;
        opacity: 0.6;
    }
    
    @keyframes floatHeart {
        0% {
            transform: translateY(100%) scale(0.5);
            opacity: 0;
        }
        50% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-100%) scale(1);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes badgePop {
        to {
            transform: scale(1);
        }
    }

    .heart-burst {
        font-size: 2.5em;
        display: block;
        margin-top: 20px;
        opacity: 0;
        animation: heartPop 0.5s ease forwards 1.8s;
        position: relative;
        z-index: 2;
    }
    
    @keyframes heartPop {
        0% {
            opacity: 0;
            transform: scale(0);
        }
        50% {
            transform: scale(1.3);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    .quote-divider {
        font-size: 1.2em;
        color: #ff8e8e;
        margin: 15px 0;
        opacity: 0.7;
    }

    .english {
        margin-bottom: 0;
    }

    .german {
        font-family: 'Georgia', serif;
        color: #ff8e8e;
    }

    .ultimate .easter-egg-badge {
        background: linear-gradient(45deg, #4a4a4a, #7a7a7a);
        font-size: 1.1em;
        padding: 8px 20px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    }

    .ultimate-quote {
        background: rgba(74, 74, 74, 0.1);
        border-left: 4px solid #4a4a4a;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .ultimate .quote-text {
        color: #4a4a4a;
        font-size: 1.3em;
    }

    .ultimate .quote-author {
        color: #7a7a7a;
    }

    .ultimate-heart {
        font-size: 1.5em !important;
        filter: grayscale(0.5);
    }

    .broken-heart-burst {
        font-size: 3em;
        display: block;
        margin-top: 20px;
        opacity: 0;
        animation: heartPop 0.5s ease forwards 1.8s;
        position: relative;
        z-index: 2;
    }

    .coding-symbols {
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-family: monospace;
        color: #4a4a4a;
        opacity: 0.5;
        font-size: 1.2em;
    }
    
    .busy-status {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(255, 107, 107, 0.1);
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.9em;
        color: #ff6b6b;
        border: 1px solid #ff6b6b;
    }
    
    .bad-boy-badge {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.1);
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.9em;
        color: #000;
        border: 1px solid #000;
    }
    
    .super-egg .easter-egg-badge {
        background: linear-gradient(45deg, #FFD700, #FFA500);
        font-size: 1.2em;
        padding: 8px 20px;
        box-shadow: 0 3px 15px rgba(255, 215, 0, 0.3);
        animation: superBadgePop 0.8s ease forwards;
    }

    .super-quote {
        background: linear-gradient(to right, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
        border-left: 4px solid #FFD700;
        box-shadow: 0 4px 20px rgba(255, 215, 0, 0.15);
    }

    .super-egg .quote-text {
        color: #b8860b;
        font-size: 1.4em;
        line-height: 1.8;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .super-egg .quote-author {
        color: #daa520;
        font-size: 1.2em;
    }

    .sparkle-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }

    .floating-sparkle {
        position: absolute;
        font-size: 1.5em;
        animation: floatSparkle 2s ease-in-out infinite;
        opacity: 0.8;
    }

    .premium-heart {
        font-size: 1.8em !important;
        filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
    }

    @keyframes floatSparkle {
        0% {
            transform: translateY(100%) rotate(0deg) scale(0.5);
            opacity: 0;
        }
        50% {
            opacity: 0.8;
            transform: translateY(50%) rotate(180deg) scale(1);
        }
        100% {
            transform: translateY(0%) rotate(360deg) scale(0.5);
            opacity: 0;
        }
    }

    @keyframes superBadgePop {
        0% {
            transform: scale(0) rotate(-180deg);
        }
        60% {
            transform: scale(1.2) rotate(10deg);
        }
        100% {
            transform: scale(1) rotate(0deg);
        }
    }

    .respect-badge {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: linear-gradient(45deg, #FFD700, #FFA500);
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.9em;
        color: white;
        box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
        animation: badgeGlow 2s ease-in-out infinite;
    }

    @keyframes badgeGlow {
        0%, 100% {
            box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
        }
        50% {
            box-shadow: 0 2px 20px rgba(255, 215, 0, 0.6);
        }
    }

    .transformation-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin: 20px 0;
        font-size: 2em;
    }

    .bad-boy-outfit {
        animation: fadeOutRotate 2s ease-in-out forwards;
    }

    .transform-arrow {
        animation: pulse 1s ease-in-out infinite;
    }

    .soft-boy {
        opacity: 0;
        animation: fadeInRotate 2s ease-in-out 1s forwards;
    }

    .transforming-symbol {
        transition: transform 0.5s ease-in-out, filter 0.5s ease-in-out;
    }

    .transforming-symbol.transform-active {
        transform: scale(1.2) rotate(360deg);
        filter: hue-rotate(180deg);
    }

    @keyframes fadeOutRotate {
        0% {
            opacity: 1;
            transform: rotate(0deg);
        }
        100% {
            opacity: 0.3;
            transform: rotate(-180deg);
        }
    }

    @keyframes fadeInRotate {
        0% {
            opacity: 0;
            transform: rotate(180deg);
        }
        100% {
            opacity: 1;
            transform: rotate(0deg);
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
    }
`;
document.head.appendChild(style);
