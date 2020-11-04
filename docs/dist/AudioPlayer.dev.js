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
    this.audioContext = null;
    this.nowPlaying = "";
    this.red = document.getElementById("red").value;
    this.blue = document.getElementById("blue").value;
    this.green = document.getElementById("green").value;
    this.createPlayerElements();
    this.colorSlider();
    this.autoPlay();
    this.upload();
    this.closeModal();
  } // to do 
  // space -> play / pause
  //  [  ]               
  // create autoplay button?
  // create play/pause button?
  // spacePlay() {
  //     const isCurrentAudio = audioItem.getAttribute('href') === (this.currentAudio && this.currentAudio.getAttribute('href'))
  //     window.addEventListener('keydown', e => {
  //         if(e.keyCode == 32) {
  //             this.audioElem.play()
  //        }
  //       })
  // }
  //create upload function


  _createClass(AudioPlayer, [{
    key: "closeModal",
    value: function closeModal() {
      var modal = document.getElementsByClassName("modal")[0];
      var closeButton = document.getElementsByClassName("close-button")[0];
      closeButton.addEventListener("click", function () {
        modal.classList.add("closed");
      });
    }
  }, {
    key: "openModal",
    value: function openModal() {
      var modal = document.getElementsByClassName("modal")[0];
      var questionButton = document.getElementsByClassName("fa-question-circle")[0];
      questionButton.addEventListener("click", function () {
        modal.classList.remove("closed");
        console.log("test");
      });
    }
  }, {
    key: "upload",
    value: function upload() {
      var _this = this;

      var uploadFile = document.getElementById("uploadbutton"); // uploadFile.addEventListener("change", () => console.log("test"))

      uploadFile.addEventListener("change", function (e) {
        // console.log(e)
        // console.log(e.target)
        // console.log(e.target.files)
        // console.log(e.target.files[0])
        var uploadURL = URL.createObjectURL(e.target.files[0]);

        _this.audio.push({
          url: "".concat(uploadURL),
          name: "".concat(e.target.files[0].name),
          artist: "N/A"
        }); // this.audioElements.push({url: `${uploadURL}`, name: `${e.target.files[0].name}`, artist: "N/A"})


        var audioItem = document.createElement('a');
        var audioArtist = document.createElement('a');
        var audioDiv = document.createElement('div');
        var playListElem = document.getElementsByClassName("playlist");
        audioDiv.classList.add("track-information");
        audioItem.setAttribute("id", "uploaded-song ".concat(e.target.files[0].name));
        audioDiv.appendChild(audioItem);
        audioDiv.appendChild(audioArtist);
        audioItem.setAttribute("name", "".concat(e.target.files[0].name));
        audioItem.setAttribute("artist", "N/A");
        audioItem.href = uploadURL;
        audioItem.innerHTML = "<i class= \"fa fa-play\"></i> ".concat(e.target.files[0].name);
        audioArtist.innerHTML = "Uploaded ";

        _this.setupEventListener(audioDiv, audioItem);

        playListElem[0].appendChild(audioDiv);
        console.log(_this.audioElements);

        _this.audioElements.push(document.getElementById("uploaded-song ".concat(e.target.files[0].name)));

        console.log(e.target.files);
        document.getElementsByClassName('playlist')[0].scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
        document.getElementsByClassName('playlist')[0].scrollIntoView(true);
      });
    }
  }, {
    key: "autoPlay",
    value: function autoPlay() {
      var _this2 = this;

      var _this$audioElem = this.audioElem,
          currentTime = _this$audioElem.currentTime,
          duration = _this$audioElem.duration;
      this.audioElem.addEventListener("ended", function () {
        return window.setTimeout(function () {
          return _this2.playNext();
        }, 1000);
      });
    }
  }, {
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
          var barHeight = dataArray[i] - 110;
          var r = barHeight + 1 / 10 * (i / bufferLength); // ctx.fillStyle = `rgb(${r}, 105, 65`; //

          var red = document.getElementById("red").value;
          var blue = document.getElementById("blue").value;
          var green = document.getElementById("green").value; // ctx.fillStyle = `rgb(${red} , ${green}, ${blue}`;

          ctx.fillStyle = "rgb(".concat(red, " , ").concat(green, ", ").concat(blue); // ctx.fillStyle = `rgb(${r}, 105, 65`; //

          ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
          bar += barWidth + 3;
        }
      }

      renderFrame();
    } // use innerHTML to save case variables
    // can be like the waves
    // can be bars
    // create buttons to change innerHTML 

  }, {
    key: "createPlayerElements",
    value: function createPlayerElements() {
      var containerElem = document.createElement('div');
      containerElem.classList.add('container');
      this.audioElem = document.createElement('audio');
      this.audioElem.addEventListener('timeupdate', this.updateTime.bind(this));
      var playListElem = document.createElement('div');
      playListElem.classList.add('playlist');
      this.visualiserElem = document.createElement('canvas');
      containerElem.appendChild(this.audioElem);
      containerElem.appendChild(playListElem);
      containerElem.appendChild(this.visualiserElem);
      var progressBarElem = document.createElement('div');
      progressBarElem.classList.add("progressBar");
      this.playerElem.appendChild(containerElem);
      this.playerElem.appendChild(progressBarElem);
      this.createPlaylistElements(playListElem);
      this.createProgressBarElements(progressBarElem);
      var nowPlayin = document.createElement('marquee');
      nowPlayin.classList.add("now-playin");
      nowPlayin.setAttribute("direction", "right");
      containerElem.appendChild(nowPlayin);
      nowPlayin.setAttribute("target", "_blank");
      nowPlayin.innerHTML = "Now Playing: ".concat(this.nowPlaying);
    }
  }, {
    key: "createProgressBarElements",
    value: function createProgressBarElements(progressBarElem) {
      var _this3 = this;

      var container = document.createElement('div');
      container.classList.add('button-container');
      var previousBtn = document.createElement("button");
      previousBtn.classList.add("playback-buttons");
      var nextBtn = document.createElement('button');
      nextBtn.classList.add("playback-buttons");
      nextBtn.innerHTML = "<i class=\"fas fa-forward\"></i>";
      previousBtn.innerHTML = "<i class=\"fas fa-backward\"></i>";
      nextBtn.addEventListener('click', this.playNext.bind(this));
      previousBtn.addEventListener('click', this.playPrevious.bind(this)); // why this.timer why not let timer = 

      this.progressBar = document.createElement('canvas');
      this.progressBar.classList.add("progress-bar-canvas");
      this.progressBar.addEventListener('click', function (e) {
        var progressBarWidth = parseInt(window.getComputedStyle(_this3.progressBar).width);
        var amountComplete = (e.clientX - _this3.progressBar.getBoundingClientRect().left) / progressBarWidth;
        _this3.audioElem.currentTime = (_this3.audioElem.duration || 0) * amountComplete;
      });
      this.timer = document.createElement("div");
      this.timer.classList.add('timer');
      container.appendChild(previousBtn);
      container.appendChild(this.timer);
      container.appendChild(nextBtn);
      progressBarElem.appendChild(container);
      progressBarElem.appendChild(this.progressBar);
    } // iterate through audio array, 
    // for each audio object create audioItem, audioArtist, audioDiv anchor tag
    // display the icon, track, artist in a row
    // slap event listener to audioDiv(the row)
    // shove it inside the main playlist element

  }, {
    key: "createPlaylistElements",
    value: function createPlaylistElements(playListElem) {
      var _this4 = this;

      this.audioElements = this.audio.map(function (audio) {
        // console.log(audio)
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

        _this4.setupEventListener(audioDiv, audioItem);

        playListElem.appendChild(audioDiv);
        return audioItem;
      });
      this.currentAudio = this.audioElements[9];
    } // chain setUpEventListener => 
    // this.nowPlaying =>
    //Render Div

  }, {
    key: "setupEventListener",
    value: function setupEventListener(audioDiv, audioItem) {
      var _this5 = this;

      audioDiv.addEventListener('click', function (e) {
        e.preventDefault();

        if (!_this5.audioContext) {
          _this5.createVisualizer();
        }

        var isCurrentAudio = audioItem.getAttribute('href') === (_this5.currentAudio && _this5.currentAudio.getAttribute('href'));

        if (isCurrentAudio && !_this5.audioElem.paused) {
          // console.log("test 1")
          _this5.setPlayIcon(_this5.currentAudio);

          _this5.audioElem.pause();
        } else if (isCurrentAudio && _this5.audioElem.paused) {
          // console.log("test 2")
          // console.log(isCurrentAudio)
          // console.log("audioItem.getAttribute('href')")
          // console.log(audioItem.getAttribute('href'))
          // console.log("this.currentAudio")
          // console.log(this.currentAudio)
          // console.log("this.currentAudio.getAttribute('href')")
          // console.log(this.currentAudio.getAttribute('href'))
          _this5.setPauseIcon(_this5.currentAudio);

          _this5.currentAudio.load;

          _this5.audioElem.play();

          console.log(_this5.audioElem.play());
        } else {
          if (_this5.currentAudio) {
            _this5.setPlayIcon(_this5.currentAudio);
          } // console.log("test 3")
          // console.log(isCurrentAudio)
          // console.log("audioItem.getAttribute('href')")
          // console.log(audioItem.getAttribute('href'))
          // console.log("this.currentAudio")
          // console.log(this.currentAudio)
          // console.log("this.currentAudio.getAttribute('href')")
          // console.log(this.currentAudio.getAttribute('href'))


          _this5.currentAudio = audioItem;
          _this5.nowPlaying = "".concat(audioItem.getAttribute("name"), " - ").concat(audioItem.getAttribute("artist"));
          var nowPlayin = document.querySelector(".now-playin");
          nowPlayin.innerHTML = "Now Playing: ".concat(_this5.nowPlaying);

          _this5.setPauseIcon(_this5.currentAudio);

          _this5.audioElem.src = _this5.currentAudio.getAttribute('href');

          _this5.audioElem.play();
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
          var red = document.getElementById("red").value;
          var blue = document.getElementById("blue").value;
          var green = document.getElementById("green").value;
          var display = document.getElementById("display"); // let link1 = document.getElementById("link-color1")
          // let link2 = document.getElementById("link-color2")

          display.style.background = "rgb(".concat(red, " , ").concat(green, ", ").concat(blue, ")"); // link1.style.color = `rgb(${red} , ${green}, ${blue})`;
          // link2.style.color = `rgb(${red} , ${green}, ${blue})`;
        });
      }
    }
  }, {
    key: "updateTime",
    value: function updateTime() {
      var parseTime = function parseTime(time) {
        var seconds = String(Math.floor(time % 60 || 0)).padStart('2', '0');
        var minutes = String(Math.floor(time / 60) || 0).padStart('2', '0');
        return "".concat(minutes, ":").concat(seconds);
      };

      var _this$audioElem2 = this.audioElem,
          currentTime = _this$audioElem2.currentTime,
          duration = _this$audioElem2.duration;
      this.timer.innerHTML = "".concat(parseTime(currentTime), "/").concat(parseTime(duration));
      this.updateProgressBar();
      this.updateProgressBar();
    }
  }, {
    key: "updateProgressBar",
    value: function updateProgressBar() {
      var progressSize = function progressSize(current, overall, width) {
        return current / overall * width;
      };

      var _this$audioElem3 = this.audioElem,
          currentTime = _this$audioElem3.currentTime,
          duration = _this$audioElem3.duration;
      var progressCtx = this.progressBar.getContext('2d');
      progressCtx.fillStyle = "#000";
      progressCtx.fillRect(0, 0, this.progressBar.width, this.progressBar.height);
      progressCtx.fillStyle = '#65ac6b';
      progressCtx.fillRect(0, 0, progressSize(currentTime, duration, this.progressBar.width), this.progressBar.height);
    }
  }, {
    key: "updateCurrentAudio",
    value: function updateCurrentAudio(nextAudio) {
      if (!this.audioContext) {
        this.createVisualizer();
      }

      this.setPlayIcon(this.currentAudio);
      this.currentAudio = nextAudio;
      this.setPauseIcon(this.currentAudio);
      this.audioElem.src = this.currentAudio.getAttribute('href');
      this.audioElem.play();
    }
  }, {
    key: "playNext",
    value: function playNext() {
      var _this6 = this;

      var index = this.audioElements.findIndex(function (audioItem) {
        return audioItem.getAttribute('href') === _this6.currentAudio.getAttribute('href');
      });
      var nextAudio = index >= this.audioElements.length - 1 ? this.audioElements[0] : this.audioElements[index + 1];
      this.updateCurrentAudio(nextAudio);
      this.nowPlaying = "".concat(nextAudio.getAttribute("name"), " - ").concat(nextAudio.getAttribute("artist"));
      var nowPlayin = document.querySelector(".now-playin");
      nowPlayin.innerHTML = "Now Playing: ".concat(this.nowPlaying);
      console.log(index);
      console.log(this.currentAudio);
    }
  }, {
    key: "playPrevious",
    value: function playPrevious() {
      var _this7 = this;

      var index = this.audioElements.findIndex(function (audioItem) {
        return audioItem.getAttribute('href') === _this7.currentAudio.getAttribute('href');
      });
      var nextAudio = index <= 0 ? this.audioElements[this.audioElements.length - 1] : this.audioElements[index - 1];
      this.updateCurrentAudio(nextAudio);
      this.nowPlaying = "".concat(nextAudio.getAttribute("name"), " - ").concat(nextAudio.getAttribute("artist"));
      var nowPlayin = document.querySelector(".now-playin");
      nowPlayin.innerHTML = "Now Playing: ".concat(this.nowPlaying);
    }
  }]);

  return AudioPlayer;
}();

exports["default"] = AudioPlayer;
{
  /* <div display block>
     <div>  modal </div>
  </div> */
}