// Initialize video.js player
var player = videojs('my-video', {
    controlBar: {
        children: [
            'playToggle', 'volumePanel', 'currentTimeDisplay',
            'timeDivider', 'durationDisplay', 'progressControl',
            'liveDisplay', 'remainingTimeDisplay', 'customControlSpacer',
            'playbackRateMenuButton', 'chaptersButton', 'descriptionsButton',
            'subtitlesButton', 'captionsButton', 'audioTrackButton'
        ]
    }
});

// Handle HLS support
if (Hls.isSupported()) {
    var hls = new Hls();
    hls.attachMedia(player.el());
}

// Overlay for URL input
const overlay = document.getElementById('overlay');
const videoURLInput = document.getElementById('videoURL');
const submitURLButton = document.getElementById('submitURL');

submitURLButton.addEventListener('click', function() {
    const url = videoURLInput.value;
    if (url) {
        player.src({
            src: url,
            type: 'application/x-mpegURL'
        });
        if (Hls.isSupported()) {
            hls.loadSource(url);
        }
        overlay.style.display = 'none';
    } else {
        alert('لطفا لینک ویدیو را وارد کنید.');
    }
});

// Populate audio tracks and subtitles
function populateTracks() {
    const audioTracks = document.getElementById('audioTracks');
    const subtitles = document.getElementById('subtitles');
    
    // Clear existing options
    audioTracks.innerHTML = '<option value="none">انتخاب صدا</option>';
    subtitles.innerHTML = '<option value="none">انتخاب زیرنویس</option>';

    // Populate audio tracks
    player.audioTracks().forEach(function(track, i) {
        let option = document.createElement('option');
        option.value = i;
        option.text = track.label || `Track ${i}`;
        audioTracks.appendChild(option);
    });

    // Populate subtitles
    player.textTracks().forEach(function(track, i) {
        let option = document.createElement('option');
        option.value = i;
        option.text = track.label || `Subtitle ${i}`;
        subtitles.appendChild(option);
    });
}

// Event listeners for controls
document.getElementById('audioTracks').addEventListener('change', function() {
    player.audioTracks().forEach((track, i) => {
        if (i == this.value) {
            track.enabled = true;
        } else {
            track.enabled = false;
        }
    });
});

document.getElementById('subtitles').addEventListener('change', function() {
    player.textTracks().forEach((track, i) => {
        track.mode = i == this.value ? "showing" : "hidden";
    });
});

document.getElementById('syncSubtitles').addEventListener('click', function() {
    let selectedTrack = document.getElementById('subtitles').value;
    if (selectedTrack !== 'none') {
        let track = player.textTracks()[selectedTrack];
        track.mode = "showing";
        // Implement sync logic here
        alert("زیرنویس همگام شد. برای تنظیم دقیق‌تر، می‌توانید زمان را به صورت دستی تنظیم کنید.");
    }
});

document.getElementById('preloadBuffer').addEventListener('change', function() {
    player.options({
        preload: 'auto',
        html5: {
            vhs: {
                maxBufferLength: parseInt(this.value)
            }
        }
    });
});

// Call populateTracks after the player is fully loaded
player.ready(function() {
    populateTracks();
});
