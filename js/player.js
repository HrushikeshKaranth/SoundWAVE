var Player = (function (window, document) {

    "use strict";
    var audio = document.querySelector("#player"),
        btnPlay = document.querySelector("#btn-play"),
        btnPause = document.querySelector("#btn-pause"),
        btnPrev = document.querySelector("#prev"),
        btnNext = document.querySelector("#next"),
        btnRepeat = document.querySelector("#repeat"),
        btnRandom = document.querySelector("#random"),
        volumeControl = document.querySelector("#volume"),
        timeLine = document.querySelector("#timeline"),
        musicTimeCount = document.querySelector("#time-count"),
        musicTime = document.querySelector("#time"),
        musicName = document.querySelector("#music-name"),
        playListElement = document.querySelector("#play-list"),
        loading = document.querySelector("#loading-music"),
        rd = new FileReader();

    var convertTime = function (time) {

        if (isNaN(time) || time == "" || typeof time != 'number') return "00:00";

        var hours = parseInt(time / 3600) % 24,
            minutes = parseInt(time / 60) % 60,
            seconds = parseInt(time % 60);

        if (hours > 0) {
            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        } else {
            var result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        }

        return result;

    };

    var Player = {};

    Player.currentTrack = 0;
    Player.isPlaying = false;
    Player.isRepeating = false;
    Player.isRandomized = false;
    Player.playList = [];

    Player.setPlayList = function (music) {
        Player.playList.push(music);
    }

    Player.clearPlayList = function () {
        Player.playList = [];
    }

    Player.showLoading = function () {
        loading.classList.add("show");
    };

    Player.hideLoading = function () {
        loading.classList.remove("show");
    };

    Player.playMusic = function (track) {

        rd.onloadstart = Player.showLoading();

        rd.onload = function () {
            audio.src = this.result;
        }

        rd.readAsDataURL(Player.playList[track]);

        audio.onloadeddata = function () {
            Player.play(track, parseInt(Player.currentTrack));
            // .play-list li border: 1px solid #1762A7;
            Player.currentTrack = parseInt(track) || 0;
            Player.setMusicName(Player.playList[track].name);
            Player.setTimeLineMax(this.duration);
            Player.setMusicTime(this.duration);
            Player.hideLoading();

        };

    };

    Player.play = function (track, lastTrack) {

        track = track || Player.currentTrack;

        if (audio.src == "") return false;

        Player.isPlaying = true;
        audio.play();
        document.getElementById("gif").style.background = "url(/images/gif6.gif) center";
        document.getElementById("btn-play").style.color = "#BC3A80";
        document.getElementById("btn-pause").style.color = "#ffffff";
        document.getElementById("listbtn" + Player.currentTrack).style.color = "#ffffff";
    };

    Player.pause = function () {

        if (audio.src == "") return false;

        Player.isPlaying = false;
        audio.pause();
        document.getElementById("btn-pause").style.color = "#BC3A80";
        document.getElementById("btn-play").style.color = "#ffffff";
        document.getElementById("gif").style.background = "none";
        document.getElementById("listbtn" + Player.currentTrack).style.color = "#097969";
    };

    Player.playPrev = function () {
        if (audio.src == "") return false;
        var prev = Player.currentTrack - 1;
        (prev > -1) ? Player.playMusic(prev) : Player.playMusic(0);
    };

    Player.playNext = function () {
        if (audio.src == "") return false;

        var next = Player.currentTrack + 1;
        var lastMusic = Player.playList.length - 1;
        if (Player.isRandomized === false) {
            (next <= lastMusic) ? Player.playMusic(next) : Player.playMusic(0);
        } else {
            var random = Math.round(Math.random() * (lastMusic));
            Player.playMusic(random);
        }
    };

    Player.repeat = function () {
        if (Player.isRepeating === false) {
            btnRepeat.classList.add("on");
            audio.setAttribute("loop", "");
            Player.isRepeating = true;
            document.getElementById("repeat").style.color = "#BC3A80";
        } else {
            btnRepeat.classList.remove("on");
            audio.removeAttribute("loop");
            Player.isRepeating = false;
            document.getElementById("repeat").style.color = "#ffffff";
        }
    };

    Player.randomize = function () {
        if (Player.isRandomized === false) {
            btnRandom.classList.add('on');
            Player.isRandomized = true;
            document.getElementById("random").style.color = "#BC3A80";
        } else {
            btnRandom.classList.remove('on');
            Player.isRandomized = false;
            document.getElementById("random").style.color = "#ffffff";
        }
    };

    Player.changeVolume = function () {
        audio.volume = volumeControl.value / 10;
    };

    Player.changeTime = function () {
        if (audio.readyState != 0) audio.currentTime = timeLine.value;
    };

    Player.timeLineUpdate = function () {
        timeLine.value = audio.currentTime;
    };

    Player.setTimeLineMax = function (time) {
        timeLine.setAttribute("max", Math.round(time));
    };

    Player.setMusicTime = function (time) {
        musicTime.innerHTML = convertTime(Math.round(time));
    };

    Player.musicCountUpdate = function (time) {
        musicTimeCount.innerHTML = convertTime(Math.round(time));
    };

    Player.setMusicName = function (name) {
        musicName.innerHTML = name.replace(".mp3", "");
    };

    Player.createPlayList = function () {
        var musicName,
            i,
            len = Player.playList.length,
            li,
            button,
            span;

        playListElement.innerHTML = "";

        for (i = 0; i < len; i += 1) {
            musicName = document.createTextNode(Player.playList[i].name.replace(".mp3", ""));

            li = document.createElement("li");
            button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("id", "listbtn" + i);
            button.setAttribute("class", "ctrlsbtn");
            button.innerHTML = "<i class='fa-solid fa-play'></i>";

            (function (id) {
                button.addEventListener('click', function () { Player.playMusic(id) }, false);
            })(i);

            li.setAttribute("class", "list-item");
            li.appendChild(button);
            li.appendChild(musicName);
            playListElement.appendChild(li);
        };
    };

    //buttons
    btnPlay.addEventListener("click", function () { Player.play(Player.currentTrack) }, false);
    btnPause.addEventListener("click", Player.pause, false);
    btnPrev.addEventListener("click", Player.playPrev, false);
    btnNext.addEventListener("click", Player.playNext, false);
    btnRepeat.addEventListener("click", Player.repeat, false);
    btnRandom.addEventListener("click", Player.randomize, false);

    //volume
    volumeControl.addEventListener("change", Player.changeVolume, false);

    //timeLine
    timeLine.addEventListener("change", Player.changeTime, false);
    timeLine.addEventListener("mousedown", function () {
        audio.removeEventListener("timeupdate", Player.timeLineUpdate);
    }, false);
    timeLine.addEventListener("mouseup", function () {
        audio.addEventListener("timeupdate", Player.timeLineUpdate, false);
    }, false);

    //player
    audio.addEventListener("ended", Player.playNext, false);
    audio.addEventListener("timeupdate", Player.timeLineUpdate, false);
    audio.addEventListener("timeupdate", function () { Player.musicCountUpdate(Math.floor(this.currentTime)); }, false);

    return {
        setPlayList: Player.setPlayList,
        clearPlayList: Player.clearPlayList,
        playMusic: Player.playMusic.bind(Player),
        createPlayList: Player.createPlayList
    }

})(window, document);