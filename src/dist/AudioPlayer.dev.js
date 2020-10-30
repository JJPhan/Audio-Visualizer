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
          var barHeight = dataArray[i] - 125;
          var r = barHeight + 25 * (i / bufferLength);
          ctx.fillStyle = "rgb(".concat(r, ", 100, 50");
          ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
          bar += barWidth + 2;
        }
      }

      renderFrame();
    }
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
    }
  }, {
    key: "createPlaylistElements",
    value: function createPlaylistElements(playListElem) {
      var _this = this;

      this.audio.forEach(function (audio) {
        var audioItem = document.createElement('a');
        var audioArtist = document.createElement('a');
        audioItem.href = audio.url;
        audioItem.innerHTML = "<i class= \"fa fa-play\"></i> ".concat(audio.name);
        audioArtist.innerHTML = "".concat(audio.artist);

        _this.setupEventListener(audioItem);

        playListElem.appendChild(audioItem);
        playListElem.appendChild(audioArtist);
      });
    }
  }, {
    key: "setupEventListener",
    value: function setupEventListener(audioItem) {
      var _this2 = this;

      audioItem.addEventListener('click', function (e) {
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

          _this2.setPauseIcon(_this2.currentAudio);

          _this2.audioElem.src = _this2.currentAudio.getAttribute('href');

          _this2.audioElem.play();
        }
      });
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
  }]);

  return AudioPlayer;
}();

exports["default"] = AudioPlayer;