"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AudioPlayer =
/*#__PURE__*/
function () {
  function AudioPlayer() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.audioPlayer';
    var audio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, AudioPlayer);

    this.playerElem = document.querySelector(selector);
    this.audio = audio;
    this.currentAudio = null;
    this.createPlayerElements();
    this.audioContext = null;
    this.nowPlaying = "";
    this.cow = "cow";
    this.red = document.getElementById("red").value;
    this.blue = document.getElementById("blue").value;
    this.green = document.getElementById("green").value;
  }

  _createClass(AudioPlayer, [{
    key: "createVisualizer",
    value: function createVisualizer() {
      this.audioContext = new AudioContext();
      var src = this.audioContext.createMediaElementSource(this.audioElem);
      var analyser = this.audioContext.createAnalyser();
      var canvas = this.visualiserElem;
      var ctx = canvas.getContext('2d');
      src.connect(analyser);
      analyser.connect(this.audioContext.destination);
      analyser.fftSize = 128;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      var barWidth = canvas.width / bufferLength * 1.5;

      function renderFrame() {
        requestAnimationFrame(renderFrame);
        var bar = 0;
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < bufferLength; i++) {
          var barHeight = dataArray[i] - 130;
          var r = barHeight + 55 * (i / bufferLength);
          ctx.fillStyle = "rgb(".concat(r, ", 105, 65"); //
          // ctx.fillStyle = `rgb(189, 65, 65`; // red
          // ctx.fillStyle = 'rgb(12,115,4)'

          ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
          bar += barWidth + 2;
        }
      }

      renderFrame();
    } // 

  }, {
    key: "createPlayerElements",
    value: function createPlayerElements() {
      this.audioElem = document.createElement('audio');
      var playListElem = document.createElement('div');
      playListElem.classList.add('playlist');
      this.visualiserElem = document.createElement('canvas');
      this.playerElem.appendChild(this.audioElem);
      this.playerElem.appendChild(playListElem);
      this.playerElem.appendChild(this.visualiserElem);
      this.createPlaylistElements(playListElem);
      var nowPlayin = document.createElement('div');
      nowPlayin.classList.add("now-playin");
      this.playerElem.appendChild(nowPlayin); // nowPlayin.innerHTML = `Now Playing: ${this.currentAudio.name} - ${this.currentAudio.artist}`
      // if (this.nowPlaying) {

      nowPlayin.innerHTML = "Now Playing: ".concat(this.cow); // }
    } // iterate through audio array, 
    // for each audio object create audioItem, audioArtist, audioDiv anchor tag
    // display the icon, track, artist in a row
    // slap event listener to audioDiv(the row)
    // shove it inside the main playlist element

  }, {
    key: "createPlaylistElements",
    value: function createPlaylistElements(playListElem) {
      var _this = this;

      this.audio.forEach(function (audio) {
        var audioItem = document.createElement('a');
        var audioArtist = document.createElement('a');
        var audioDiv = document.createElement('div');
        audioDiv.classList.add("track-information");
        audioDiv.appendChild(audioItem);
        audioDiv.appendChild(audioArtist); // set attribute vs ln 95
        // get attribute vs audioItem.name/artist

        audioItem.setAttribute("name", "".concat(audio.name));
        audioItem.setAttribute("artist", "".concat(audio.artist));
        audioItem.href = audio.url;
        audioItem.innerHTML = "<i class= \"fa fa-play\"></i> ".concat(audio.name);
        audioArtist.innerHTML = "".concat(audio.artist);

        _this.setupEventListener(audioDiv, audioItem);

        playListElem.appendChild(audioDiv);
      });
    } // chain setUpEventListener => 
    // this.nowPlaying =>
    //Render Div

  }, {
    key: "setupEventListener",
    value: function setupEventListener(audioDiv, audioItem) {
      var _this2 = this;

      audioDiv.addEventListener('click', function (e) {
        e.preventDefault();

        if (!_this2.audioContext) {
          _this2.createVisualizer();
        }

        var isCurrentAudio = audioItem.getAttribute('href') === (_this2.currentAudio && _this2.currentAudio.getAttribute('href'));

        if (isCurrentAudio && !_this2.audioElem.paused) {
          _this2.setPlayIcon(_this2.currentAudio);

          _this2.audioElem.pause();
        } else if (isCurrentAudio && _this2.audioElem.paused) {
          _this2.setPauseIcon(_this2.currentAudio);

          _this2.audioElem.play();
        } else {
          if (_this2.currentAudio) {
            _this2.setPlayIcon(_this2.currentAudio);
          }

          _this2.currentAudio = audioItem;
          _this2.nowPlaying = "".concat(audioItem.getAttribute("name"), " - ").concat(audioItem.getAttribute("artist"));
          {
            console.log(_this2);
          }
          {
            console.log(_this2.cow);
          }
          {
            console.log(_this2.nowPlaying);
          } /// test

          _this2.setPauseIcon(_this2.currentAudio);

          _this2.audioElem.src = _this2.currentAudio.getAttribute('href');

          _this2.audioElem.play();
        }
      });
    }
  }, {
    key: "createSlider",
    value: function createSlider(r) {
      var slider = document.createElement("input");
      slider.setAttribute("type", "range");
      slider.setAttribute("min", "0");
      slider.setAttribute("max", "100");
      slider.setAttribute("value", "0");
    }
  }, {
    key: "setPlayIcon",
    value: function setPlayIcon(elem) {
      var icon = elem.querySelector('i');
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
    }
  }, {
    key: "setPauseIcon",
    value: function setPauseIcon(elem) {
      var icon = elem.querySelector('i');
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
    }
  }, {
    key: "colorSlider",
    value: function colorSlider() {
      var input = document.querySelectorAll("input");

      for (var i = 0; i < input.length; i++) {
        input[i].addEventListener("input", function () {
          this.red = document.getElementById("red").value;
          this.blue = document.getElementById("blue").value;
          this.green = document.getElementById("green").value;
          var display = document.getElementById("display");
          display.style.background = "rgb(" + red + ", " + green + ", " + blue + ")";
        });
      }
    }
  }]);

  return AudioPlayer;
}();

exports["default"] = AudioPlayer;