'use strict';

var isMuted = false;
var backgroundAudio = document.getElementById('backgroundAudio');
var muteButton = document.getElementById('muteButton');

function mute() {
    if (isMuted){
        backgroundAudio.muted = false;
        muteButton.src = 'SimmiBird/images/mute.png';
        isMuted = false;
    }
    else {
        backgroundAudio.muted = true;
        muteButton.src = 'SimmiBird/images/unmute.png';
        isMuted = true;
    }
}

mute();