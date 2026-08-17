/**
 * ==========================================================================
 * SARITHA TEA STALL - VINTAGE MALAYALAM RADIO CONTROLLER
 * Official YouTube IFrame Player API + Independent Rain Ambience
 * + Collapsible Transparent Glassmorphism Sidebar
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. CONFIGURATION & PLAYLIST DATA
// --------------------------------------------------------------------------

// Easy-to-edit YouTube Music playlist URL (Opens in top right button & footer)
const YOUTUBE_MUSIC_PLAYLIST_URL = "https://music.youtube.com/playlist?list=PLMQF3xXq-vkU&si=-tM8YgIAf2SYpmG2";

// Vintage Malayalam Songs List
// Each song includes title, singer, movie, year, artwork, YouTube ID, and channel name
const songs = [
    {
        title: "മായാമഞ്ചലിൽ",
        singer: "G.Venugopal & Radhika Thilak",
        movie: "ഒറ്റയാൾ പട്ടാളം",
        year: 1991,
        artwork: "assets/images/poster1.jpg",
        youtubeId: "B9BmjGD29sQ",
        youtubeChannel: "Sony Music Malayalam"
    },
    {
        title: "പൂങ്കാറ്റിനോടും കിളികളോടും",
        singer: "K.J Yesudas & S.Janaki",
        movie: "പൂമുഖപ്പടിയിൽ നിന്നെയും കാത്ത്",
        year: 1986,
        artwork: "assets/images/poster2.jpg",
        youtubeId: "GIm78r4zv5c",
        youtubeChannel: "Satyam Audios"
    },
    {
        title: "കണ്ടു ഞാൻ മിഴികളിൽ",
        singer: "M.G Sreekumar",
        movie: "അഭിമന്യു",
        year: 1991,
        artwork: "assets/images/poster3.jpg",
        youtubeId: "CbgJc51XQDI",
        youtubeChannel: "Cinema Paattu"
    },
    {
        title: "ഒന്നാം രാഗം പാടി",
        singer: "G.Venugopal & K.S Chithra",
        movie: "തൂവാനത്തുമ്പികൾ",
        year: 1987,
        artwork: "assets/images/poster4.jpg",
        youtubeId: "dMZ2JhAgLcs",
        youtubeChannel: "G Venugopal - Topic"
    },
    {
        title: "ശ്രീരാഗമോ തേടുന്നു",
        singer: "K.J Yesudas",
        movie: "പവിത്രം",
        year: 1994,
        artwork: "assets/images/poster5.jpg",
        youtubeId: "aD9lDmwt9rk",
        youtubeChannel: "Music Zone"
    },
    {
        title: "പവിഴമല്ലി പൂത്തുലഞ്ഞ",
        singer: "K.J Yesudas",
        movie: "സന്മനസ്സുള്ളവർക്ക് സമാധാനം",
        year: 1986,
        artwork: "assets/images/poster6.jpg",
        youtubeId: "LlTAnB1LbWU",
        youtubeChannel: "K.J. Yesudas - Topic"
    },
    {
        title: "ദൂരെ കിഴക്കുദിക്കിൻ",
        singer: "M.G Sreekumar & Sujatha Mohan",
        movie: "ചിത്രം",
        year: 1988,
        artwork: "assets/images/poster7.jpg",
        youtubeId: "8AR7J1f4sL0",
        youtubeChannel: "Music House (MH)"
    },
    {
        title: "വികാര നൗകയുമായി",
        singer: "K.J Yesudas",
        movie: "അമരം",
        year: 1991,
        artwork: "assets/images/poster8.jpg",
        youtubeId: "qboVkft8TtI",
        youtubeChannel: "Malayalam Cassettes"
    },
    {
        title: "ആരോ വിരൽ നീട്ടി",
        singer: "K.J Yesudas",
        movie: "പ്രണയവർണ്ണങ്ങൾ",
        year: 1998,
        artwork: "assets/images/poster9.jpg",
        youtubeId: "riI3FqDM_0g",
        youtubeChannel: "Cinema Paattu"
    },
    {
        title: "ആലില താലിയുമായ്",
        singer: "P. Jayachandran",
        movie: "Mizhirandilum",
        year: 2003,
        artwork: "assets/images/poster10.jpg",
        youtubeId: "qMyXYzQPHY4",
        youtubeChannel: "Music Zone"
    },
    {
        title: "ഏതോ വാർ‍മുകിലിൻ",
        singer: "K.S Chithra",
        movie: "Pookkaalam Varavaayi",
        year: 1991,
        artwork: "assets/images/poster11.jpg",
        youtubeId: "vxoHHR_UPd8",
        youtubeChannel: "Evergreen film songs"
    }
];

// --------------------------------------------------------------------------
// 2. STATE MANAGEMENT
// --------------------------------------------------------------------------
let currentSongIndex = 0;
let ytPlayer = null;
let isPlayerReady = false;
let isPlaying = false;
let isUserScrubbing = false;
let progressUpdateTimer = null;
let lastSongChangeTimestamp = 0;

// Rain Audio Object (Independent HTML5 Audio)
const rainAudio = new Audio();
rainAudio.loop = true;
let isRainMuted = false;
let hasUserInteracted = false;

// --------------------------------------------------------------------------
// 3. DOM ELEMENTS
// --------------------------------------------------------------------------
const songThumbnail = document.getElementById("song-thumbnail");
const songTitle = document.getElementById("song-title");
const youtubeChannel = document.getElementById("youtube-channel");
const progressSlider = document.getElementById("progress-slider");
const currentTimeLabel = document.getElementById("current-time");
const totalDurationLabel = document.getElementById("total-duration");

const prevBtn = document.getElementById("prev-btn");
const playPauseBtn = document.getElementById("play-pause-btn");
const nextBtn = document.getElementById("next-btn");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");

const musicVolBtn = document.getElementById("music-vol-btn");
const musicVolumeSlider = document.getElementById("music-volume-slider");
const rainVolBtn = document.getElementById("rain-vol-btn");
const rainVolumeSlider = document.getElementById("rain-volume-slider");
const rainSoundSelect = document.getElementById("rain-sound-select");

const liveClock = document.getElementById("live-clock");
const listenerCount = document.getElementById("listener-count");
const ytMusicBtn = document.getElementById("yt-music-btn");

// Sidebar DOM Elements
const songSidebar = document.getElementById("song-sidebar");
const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
const sidebarPlaylist = document.getElementById("sidebar-playlist");

// Support Modal DOM Elements
const supportBtn = document.getElementById("support-btn");
const supportModalOverlay = document.getElementById("support-modal-overlay");
const supportModalClose = document.getElementById("support-modal-close");
const supportModalBackdrop = document.getElementById("support-modal-backdrop");

function openSupportModal() {
    if (supportModalOverlay) {
        supportModalOverlay.classList.add("active");
        supportModalOverlay.setAttribute("aria-hidden", "false");
    }
}

function closeSupportModal() {
    if (supportModalOverlay) {
        supportModalOverlay.classList.remove("active");
        supportModalOverlay.setAttribute("aria-hidden", "true");
    }
}

// --------------------------------------------------------------------------
// 4. INITIALIZATION & SETUP
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Set YouTube Music links (Top Bar & Footer)
    if (ytMusicBtn) {
        ytMusicBtn.href = YOUTUBE_MUSIC_PLAYLIST_URL;
    }
    const ytMusicFooterBtn = document.getElementById("yt-music-footer-btn");
    if (ytMusicFooterBtn) {
        ytMusicFooterBtn.href = YOUTUBE_MUSIC_PLAYLIST_URL;
    }

    // Set initial song title and YouTube channel name
    updateSongDisplay(currentSongIndex);

    // Render Songs in Sidebar Playlist
    renderSidebarPlaylist();

    // Initialize Rain Audio
    initRainAudio();

    // Start Live Clock
    startClock();

    // Start subtle listener count fluctuation
    startListenerSimulation();

    // Setup Event Listeners
    setupEventListeners();

    // Set initial slider track fills
    updateSliderFill(musicVolumeSlider, musicVolumeSlider.value);
    updateSliderFill(rainVolumeSlider, rainVolumeSlider.value);
    updateSliderProgress(0);
});

// --------------------------------------------------------------------------
// 5. OFFICIAL YOUTUBE IFRAME API INTEGRATION
// --------------------------------------------------------------------------
window.onYouTubeIframeAPIReady = function () {
    const initialSong = songs[currentSongIndex];

    ytPlayer = new YT.Player("youtube-player", {
        height: "180",
        width: "320",
        videoId: initialSong.youtubeId,
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            playsinline: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
        }
    });
};

function onPlayerReady(event) {
    isPlayerReady = true;
    const initialVol = parseInt(musicVolumeSlider.value, 10);
    ytPlayer.setVolume(initialVol);
    updateSliderFill(musicVolumeSlider, initialVol);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseUI(true);
        startProgressTracking();
        renderSidebarPlaylist();
        
        // Start rain if unmuted
        if (!isRainMuted && rainAudio.paused) {
            rainAudio.play().catch(() => {});
        }
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayPauseUI(false);
        stopProgressTracking();
    } else if (event.data === YT.PlayerState.ENDED) {
        stopProgressTracking();
        handleSongEnded();
    }
}

function onPlayerError(errorEvent) {
    console.warn("YouTube Player error event:", errorEvent.data);
    isPlaying = false;
    updatePlayPauseUI(false);
    stopProgressTracking();
}

function handleSongEnded() {
    const now = Date.now();
    if (now - lastSongChangeTimestamp < 2000) return;
    // Let playNextSong update the timestamp, otherwise it returns early
    playNextSong();
}

// --------------------------------------------------------------------------
// 6. PLAYBACK CONTROL FUNCTIONS
// --------------------------------------------------------------------------
function togglePlayPause() {
    hasUserInteracted = true;

    // Start rain audio on initial user interaction if unmuted
    if (!isRainMuted && rainAudio.paused) {
        rainAudio.play().catch(e => console.log("Rain play prevented:", e));
    }

    if (!isPlayerReady || !ytPlayer) {
        console.warn("YouTube Player is loading...");
        return;
    }

    try {
        const state = ytPlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
    } catch (e) {
        ytPlayer.playVideo();
    }
}

function playNextSong() {
    const now = Date.now();
    if (now - lastSongChangeTimestamp < 400) return;
    lastSongChangeTimestamp = now;

    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadAndPlaySong(currentSongIndex);
}

function playPrevSong() {
    const now = Date.now();
    if (now - lastSongChangeTimestamp < 400) return;
    lastSongChangeTimestamp = now;

    // If more than 3 seconds into the track, restart current song
    if (ytPlayer && typeof ytPlayer.getCurrentTime === "function" && ytPlayer.getCurrentTime() > 3) {
        ytPlayer.seekTo(0, true);
        return;
    }

    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadAndPlaySong(currentSongIndex);
}

function selectSong(index) {
    hasUserInteracted = true;
    currentSongIndex = index;
    loadAndPlaySong(currentSongIndex);
    
    // Auto collapse sidebar on mobile after selection for seamless listening
    if (window.innerWidth <= 768 && songSidebar) {
        songSidebar.classList.add("collapsed");
    }
}

function loadAndPlaySong(index) {
    updateSongDisplay(index);
    updateSliderProgress(0);
    currentTimeLabel.textContent = "0:00";
    totalDurationLabel.textContent = "0:00";

    if (isPlayerReady && ytPlayer) {
        ytPlayer.loadVideoById(songs[index].youtubeId);
        isPlaying = true;
        updatePlayPauseUI(true);
    }

    renderSidebarPlaylist();

    if (!isRainMuted && rainAudio.paused && hasUserInteracted) {
        rainAudio.play().catch(() => {});
    }
}

function updateSongDisplay(index) {
    const song = songs[index];
    songTitle.textContent = song.title;
    youtubeChannel.textContent = song.youtubeChannel;
    
    // Set thumbnail
    songThumbnail.src = song.artwork || song.thumbnail || `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`;
    songThumbnail.alt = `${song.title} - ${song.youtubeChannel}`;
}

function updatePlayPauseUI(playing) {
    if (playing) {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        songThumbnail.classList.add("rotating");
    } else {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        songThumbnail.classList.remove("rotating");
    }
}

// --------------------------------------------------------------------------
// 7. SIDEBAR PLAYLIST RENDERING & TOGGLE
// --------------------------------------------------------------------------
function renderSidebarPlaylist() {
    if (!sidebarPlaylist) return;

    sidebarPlaylist.innerHTML = songs.map((song, index) => {
        const isActive = index === currentSongIndex;
        const seqNum = (index + 1).toString().padStart(2, "0");
        return `
            <div class="sidebar-song-item ${isActive ? 'active' : ''}" onclick="selectSong(${index})" data-index="${index}" title="${song.title} - ${song.singer}">
                <div class="song-seq-num">${seqNum}</div>
                <div class="song-item-info">
                    <div class="song-item-title">${song.title}</div>
                    <div class="song-item-sub">
                        <span>${song.singer}</span> • <span>${song.movie}</span> <span>(${song.year})</span>
                    </div>
                </div>
                ${isActive && isPlaying ? `
                    <div class="playing-equalizer">
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                    </div>
                ` : ''}
            </div>
        `;
    }).join("");
}

function toggleSidebar() {
    if (songSidebar) {
        songSidebar.classList.toggle("collapsed");
    }
}

// --------------------------------------------------------------------------
// 8. PROGRESS BAR & REAL-TIME TIMESTAMPS
// --------------------------------------------------------------------------
function startProgressTracking() {
    stopProgressTracking();
    progressUpdateTimer = setInterval(updateProgressUI, 350);
}

function stopProgressTracking() {
    if (progressUpdateTimer) {
        clearInterval(progressUpdateTimer);
        progressUpdateTimer = null;
    }
}

function updateProgressUI() {
    if (!isPlayerReady || !ytPlayer || isUserScrubbing) return;

    try {
        const currentTime = ytPlayer.getCurrentTime() || 0;
        const duration = ytPlayer.getDuration() || 0;

        if (duration > 0) {
            const percent = (currentTime / duration) * 100;
            progressSlider.value = percent;
            updateSliderProgress(percent);
            currentTimeLabel.textContent = formatTime(currentTime);
            totalDurationLabel.textContent = formatTime(duration);
        }
    } catch (e) {}
}

function updateSliderProgress(percent) {
    progressSlider.style.setProperty("--progress-percent", `${percent}%`);
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// --------------------------------------------------------------------------
// 9. RAIN AMBIENCE SYSTEM (INDEPENDENT HTML5 AUDIO)
// --------------------------------------------------------------------------
function initRainAudio() {
    const selectedFile = rainSoundSelect.value || "rain.mp3";
    rainAudio.src = `assets/rain/${selectedFile}`;
    const initialRainVol = parseInt(rainVolumeSlider.value, 10) / 100;
    rainAudio.volume = initialRainVol;
}

function toggleRainMute() {
    isRainMuted = !isRainMuted;
    if (isRainMuted) {
        rainAudio.pause();
        rainVolBtn.classList.add("muted");
        rainVolBtn.title = "Unmute Rain Ambience";
    } else {
        hasUserInteracted = true;
        rainAudio.play().catch(e => console.log("Audio play allowed on user click:", e));
        rainVolBtn.classList.remove("muted");
        rainVolBtn.title = "Mute Rain Ambience";
    }
}

function changeRainTrack(filename) {
    const wasPlaying = !rainAudio.paused;
    rainAudio.src = `assets/rain/${filename}`;
    if (wasPlaying && !isRainMuted) {
        rainAudio.play().catch(() => {});
    }
}

// --------------------------------------------------------------------------
// 10. SLIDER UTILITIES & EVENT HANDLERS
// --------------------------------------------------------------------------
function updateSliderFill(slider, value) {
    const percent = ((value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty("--vol-percent", `${percent}%`);
}

function setupEventListeners() {
    // Playback Buttons
    playPauseBtn.addEventListener("click", togglePlayPause);
    prevBtn.addEventListener("click", playPrevSong);
    nextBtn.addEventListener("click", playNextSong);

    // Sidebar Toggle & Close Buttons
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener("click", toggleSidebar);
    }
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener("click", toggleSidebar);
    }

    // Progress Bar Scrubbing
    progressSlider.addEventListener("input", (e) => {
        isUserScrubbing = true;
        const percent = parseFloat(e.target.value);
        updateSliderProgress(percent);
        if (isPlayerReady && ytPlayer) {
            const duration = ytPlayer.getDuration() || 0;
            const targetTime = (percent / 100) * duration;
            currentTimeLabel.textContent = formatTime(targetTime);
        }
    });

    progressSlider.addEventListener("change", (e) => {
        isUserScrubbing = false;
        if (isPlayerReady && ytPlayer) {
            const duration = ytPlayer.getDuration() || 0;
            const targetTime = (parseFloat(e.target.value) / 100) * duration;
            ytPlayer.seekTo(targetTime, true);
        }
    });

    // Music Volume
    musicVolumeSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        updateSliderFill(musicVolumeSlider, val);
        if (isPlayerReady && ytPlayer) {
            ytPlayer.setVolume(val);
            if (ytPlayer.isMuted() && val > 0) {
                ytPlayer.unMute();
            }
        }
    });

    // Music Volume Mute Toggle
    musicVolBtn.addEventListener("click", () => {
        if (!isPlayerReady || !ytPlayer) return;
        if (ytPlayer.isMuted()) {
            ytPlayer.unMute();
            musicVolBtn.style.opacity = "1";
        } else {
            ytPlayer.mute();
            musicVolBtn.style.opacity = "0.35";
        }
    });

    // Rain Volume
    rainVolumeSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        updateSliderFill(rainVolumeSlider, val);
        rainAudio.volume = val / 100;
        if (isRainMuted && val > 0) {
            toggleRainMute();
        }
    });

    // Rain Mute Button
    rainVolBtn.addEventListener("click", toggleRainMute);

    // Rain Sound Dropdown
    rainSoundSelect.addEventListener("change", (e) => {
        changeRainTrack(e.target.value);
    });

    // Support Modal Open & Close Listeners
    if (supportBtn) {
        supportBtn.addEventListener("click", openSupportModal);
    }
    if (supportModalClose) {
        supportModalClose.addEventListener("click", closeSupportModal);
    }
    if (supportModalBackdrop) {
        supportModalBackdrop.addEventListener("click", closeSupportModal);
    }

    // Copy UPI ID to Clipboard
    const copyUpiBtn = document.getElementById("copy-upi-btn");
    const upiIdText = document.getElementById("upi-id-text");
    if (copyUpiBtn && upiIdText) {
        copyUpiBtn.addEventListener("click", () => {
            const rawId = upiIdText.textContent.trim();
            navigator.clipboard.writeText(rawId).then(() => {
                const originalText = upiIdText.textContent;
                upiIdText.textContent = "Copied! ✓";
                setTimeout(() => {
                    upiIdText.textContent = originalText;
                }, 2000);
            }).catch(() => {
                // Fallback
                upiIdText.textContent = "Copied! ✓";
                setTimeout(() => {
                    upiIdText.textContent = "saranvarma67@okhdfcbank";
                }, 2000);
            });
        });
    }

    // Global Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
        // Close modal on Escape
        if (e.key === "Escape" && supportModalOverlay && supportModalOverlay.classList.contains("active")) {
            closeSupportModal();
            return;
        }

        if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "SELECT") {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === "ArrowRight" && e.altKey) {
            playNextSong();
        } else if (e.code === "ArrowLeft" && e.altKey) {
            playPrevSong();
        }
    });
}

// --------------------------------------------------------------------------
// 11. REAL-TIME LOCAL CLOCK
// --------------------------------------------------------------------------
function startClock() {
    function updateClock() {
        const now = new Date();
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        };
        liveClock.textContent = now.toLocaleTimeString("en-US", options);
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// --------------------------------------------------------------------------
// 12. LISTENER COUNT ANIMATION
// --------------------------------------------------------------------------
function startListenerSimulation() {
    let baseCount = 128;
    setInterval(() => {
        const shift = Math.floor(Math.random() * 5) - 2;
        baseCount = Math.max(115, Math.min(150, baseCount + shift));
        listenerCount.textContent = `${baseCount} listening`;
    }, 12000);
}

function getVisitorId() {
  let visitorId = localStorage.getItem('visitor_id');

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    localStorage.setItem(
      'visitor_id',
      visitorId
    );
  }

  return visitorId;
}


async function sendHeartbeat() {
  try {
    const visitorId = getVisitorId();

    const response = await fetch(
      '/.netlify/functions/heartbeat',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          visitorId: visitorId
        })
      }
    );

    const data = await response.json();

    console.log(
      'Active listeners:',
      data.activeListeners
    );

    // Update your UI here
    const countElement =
      document.getElementById('listener-count');

    if (countElement) {
      countElement.textContent =
        data.activeListeners;
    }

  } catch (error) {
    console.error(
      'Heartbeat failed:',
      error
    );
  }
}

sendHeartbeat();

setInterval(sendHeartbeat, 30000);
