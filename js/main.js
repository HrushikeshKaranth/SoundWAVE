(function () {
    "use strict";
    var btnUpload = document.querySelector("#btn-upload"),
        fileElement = document.querySelector("#file-element"),
        htmlTag = document.querySelector('html'),

        setLocalStorage = function (item, value) {
            if (localStorage) {
                localStorage.setItem(item, value);
            } else {
                return "";
            }
        },

        getLocalStorage = function (item) {
            if (localStorage.getItem(item)) {
                return localStorage.getItem(item);
            }

            return "";
        };

    btnUpload.addEventListener("click", function (e) {
        if (fileElement) {
            fileElement.click();
        }

        e.stopPropagation();
        e.preventDefault();
    }, false);

    fileElement.addEventListener("change", function () {
        var i,
            len = this.files.length;

        Player.clearPlayList();
        for (i = 0; i < len; i += 1) {
            Player.setPlayList(this.files[i]);
        }

        Player.playMusic.apply(Player, [0]);
        Player.createPlayList();

    }, false);
}());