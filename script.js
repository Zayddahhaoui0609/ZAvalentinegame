// Initialize audio context
let audioContext;

// Sound effects and Music Player
const sounds = {
    pop: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3')
};

// Music playlist with direct URLs
const musicPlaylist = [
    "https://dl.dropboxusercontent.com/scl/fi/2xl25vx27aa81lkwron9v/Bill-Withers-Just-The-Two-Of-Us-Lyrics.mp3?rlkey=apfnvaw9bi0b0q7az5fs6emzr",
    "https://dl.dropboxusercontent.com/scl/fi/meqk5ddb7mrpb3x93i93v/Joji-Glimpse-of-Us.mp3?rlkey=m0u0sm3edy0yr3qcqtmivspud",
    "https://dl.dropboxusercontent.com/scl/fi/ynq5o0ragvv11ti45c2m7/Joji-Like-You-Do.mp3?rlkey=nk6d9yoxtvnh0zik791syumh5",
    "https://dl.dropboxusercontent.com/scl/fi/r0lzjity72haquomzle0y/Lady-Gaga-Bruno-Mars-Die-With-A-Smile-Official-Music-Video.mp3?rlkey=hf3d5gtzu40xa8wqhm8bvilis",
    "https://dl.dropboxusercontent.com/scl/fi/i68wzacbgnk0a9gm8eht2/Rex-Orange-County-Loving-is-Easy-feat.-Benny-Sings-Official-Video.mp3?rlkey=zppnonxgwnid098cni98bwf5u",
    "https://dl.dropboxusercontent.com/scl/fi/ob4o8tnf4ux8t63nb4fvr/SZA-Snooze-Official-Video.mp3?rlkey=sc8qokmsfipzankvz633sq4n1",
    "https://dl.dropboxusercontent.com/scl/fi/dyckon54fjhc0dq6edvrg/SZA-The-Weeknd-Official-Audio.mp3?rlkey=c82invvaa0g9jkrbxgrv4t23w",
    "https://dl.dropboxusercontent.com/scl/fi/qpk6lsjmjxwaqndi4nz1b/The-Weeknd-Die-For-You-Official-Music-Video.mp3?rlkey=ph54sp9efck5at24ko1dd85nh",
    "https://dl.dropboxusercontent.com/scl/fi/mqfyvcuu0bmr1khvgbmbd/d4vd-Here-With-Me-Official-Music-Video.mp3?rlkey=x2fndyliysxx5fz4x2mf4rmle",
    "https://dl.dropboxusercontent.com/scl/fi/6rtvkpc97zme8nxaspc3j/d4vd-Romantic-Homicide.mp3?rlkey=8rl6ot4k751kac8r1ttu06xop"
];

let currentMusicIndex = 0;
let currentMusic = null;
let isMusicPlaying = false;

// Function to initialize audio context
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
}

// Function to get song name from URL
function getSongName(url) {
    const decodedUrl = decodeURIComponent(url);
    const fileName = decodedUrl.split('/').pop();
    return fileName.split('?')[0].replace('.mp3', '');
}

// Function to update current song display
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
async function playSong() {
    try {
        initAudioContext();
        
        if (currentMusic) {
            currentMusic.pause();
            currentMusic = null;
        }

        const song = musicPlaylist[currentMusicIndex];
        console.log('Attempting to play:', song);

        currentMusic = new Audio(song);
        
        // Add error handling
        currentMusic.onerror = (e) => {
            console.error('Error loading song:', song, e.target.error);
            setTimeout(playNextSong, 2000);
        };

        // Wait for the audio to be loaded
        await new Promise((resolve, reject) => {
            currentMusic.addEventListener('canplaythrough', resolve, { once: true });
            currentMusic.addEventListener('error', reject, { once: true });
            currentMusic.load();
        });

        // Play the audio
        await currentMusic.play();
        isMusicPlaying = true;
        document.getElementById('playBtn').textContent = '⏸️';
        updateCurrentSongDisplay();
        updateProgressBar();

        // Add ended event listener
        currentMusic.addEventListener('ended', playNextSong);

    } catch (error) {
        console.error('Error playing song:', error);
        setTimeout(playNextSong, 2000);
    }
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
        speed: 3,
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

// Milestone messages for different score levels
const milestoneMessages = {
    10: "Nice start! But can you handle what's next? 👀",
    20: "Okay, you're getting serious. Still single tho? 💀",
    30: "Bro, are you training for the Olympics? 🏃‍♂️💨",
    40: "At this point, you deserve a Valentine. 💘",
    50: "Relax, it's just a game… or is it? 🤯",
    60: "This isn't even my final form. 🔥",
    70: "Do you even have a life outside this game? 🤡",
    100: "Congratulations! You win… absolutely nothing. 🎉💀"
};

// Base game speed and speed increase factors
let gameSpeed = 1;
const speedIncreaseFactor = 1.2;
let lastMilestoneScore = 0;

// Function to show milestone message with animation
function showMilestoneMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'milestone-message';
    messageDiv.textContent = message;
    document.querySelector('.game-container').appendChild(messageDiv);

    // Add screen shake effect
    document.querySelector('.game-container').classList.add('screen-shake');

    // Play milestone sound
    sounds.milestone = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    sounds.milestone.play();

    // Remove message and screen shake after animation
    setTimeout(() => {
        messageDiv.remove();
        document.querySelector('.game-container').classList.remove('screen-shake');
    }, 3000);
}

// Function to increase game speed
function increaseGameSpeed() {
    gameSpeed *= speedIncreaseFactor;
    // Update enemy and heart speeds
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        const currentSpeed = parseFloat(enemy.dataset.speed);
        enemy.dataset.speed = currentSpeed * speedIncreaseFactor;
    });
}

// Function to check milestones
function checkMilestones(score) {
    const milestone = Math.floor(score / 10) * 10;
    if (milestone > lastMilestoneScore && milestoneMessages[milestone]) {
        showMilestoneMessage(milestoneMessages[milestone]);
        increaseGameSpeed();
        lastMilestoneScore = milestone;
    }
}

// Mini-game functionality
let gameActive = false;
let gameCleanup = null;

document.getElementById('startGame').addEventListener('click', () => {
    const gameSection = document.getElementById('gameSection');
    const quizSection = document.getElementById('quizSection');
    
    if (gameSection.style.display === 'none') {
        // Show game section
        gameSection.style.display = 'block';
        quizSection.style.display = 'none';
        
        // Start the heart catcher game
        gameActive = true;
        gameCleanup = startHeartCatcher();
    } else {
        // Hide and cleanup game
        gameSection.style.display = 'none';
        gameActive = false;
        if (gameCleanup) {
            gameCleanup();
            gameCleanup = null;
        }
    }
});

// Heart Catcher Game Logic
function startHeartCatcher() {
    const gameSection = document.getElementById('gameSection');
    const gameContainer = document.querySelector('.game-container');
    const scoreDisplay = document.getElementById('score');

    // Initialize game state
    let score = 0;
    scoreDisplay.textContent = 'Score: 0';
    let isActive = true;
    
    function updateScore() {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        checkMilestones(score);
    }

    function createHeart() {
        if (!isActive) return;

        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.innerHTML = '❤️';
        
        // Random position and size
        const randomX = Math.random() * (gameContainer.offsetWidth - 40);
        const randomScale = 0.8 + Math.random() * 0.4;
        heart.style.left = randomX + 'px';
        heart.style.top = '-50px';
        heart.style.transform = `scale(${randomScale})`;
        
        // Click handler
        heart.addEventListener('click', () => {
            if (!isActive) return;
            updateScore();
            if (sounds.pop) sounds.pop.play();
            
            // Remove with animation
            heart.style.transform = `scale(${randomScale * 1.5})`;
            heart.style.opacity = '0';
            setTimeout(() => heart.remove(), 200);
        });
        
        gameContainer.appendChild(heart);
        
        // Animate falling
        let pos = -50;
        const speed = 1 + Math.random() * 1.5;
        let lastTime = performance.now();
        
        function fall(currentTime) {
            if (!isActive) {
                heart.remove();
                return;
            }
            
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            pos += speed * (deltaTime / 16);
            heart.style.top = pos + 'px';
            
            if (pos < gameContainer.offsetHeight) {
                requestAnimationFrame(fall);
            } else {
                heart.remove();
            }
        }
        
        requestAnimationFrame(fall);
    }

    // Create hearts at a regular interval
    const spawnInterval = setInterval(createHeart, 800);

    // Cleanup function
    return () => {
        isActive = false;
        clearInterval(spawnInterval);
        const hearts = gameContainer.querySelectorAll('.falling-heart');
        hearts.forEach(heart => heart.remove());
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
    };
}

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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

    .milestone-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.9);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 24px;
        text-align: center;
        animation: popIn 0.5s ease-out;
    }

    @keyframes popIn {
        0% { transform: translate(-50%, -50%) scale(0); }
        70% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }

    .screen-shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }

    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
) rotate(360deg) scale(0.5);
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

    .milestone-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.9);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 24px;
        text-align: center;
        animation: popIn 0.5s ease-out;
    }

    @keyframes popIn {
        0% { transform: translate(-50%, -50%) scale(0); }
        70% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }

    .screen-shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }

    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
`;
document.head.appendChild(style);
