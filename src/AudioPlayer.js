export default class AudioPlayer {
    constructor(selector = '.audioPlayer', audio = []) {

        this.playerElem = document.querySelector(selector);
        this.audio = audio;
        this.currentAudio = null;
        this.createPlayerElements();
        this.audioContext = null; 
    }

    createVisualizer() {
        this.audioContext = new AudioContext();

        const src = this.audioContext.createMediaElementSource(this.audioElem);
        const analyser = this.audioContext.createAnalyser();
        const canvas = this.visualiserElem;
        const ctx = canvas.getContext('2d');

        src.connect(analyser);
        analyser.connect(this.audioContext.destination);
        analyser.fftSize = 128;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = (canvas.width / bufferLength) * 1.5;

        function renderFrame() {
            requestAnimationFrame(renderFrame);

            let bar = 0;
            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] - 130;
                const r = barHeight + (55 * (i / bufferLength))
                // ctx.fillStyle = `rgb(${r}, 100, 50`;
                ctx.fillStyle = `rgb(189, 65, 65`;
                // ctx.fillStyle = 'rgb(12,115,4)'
                ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
                bar += barWidth + 2;
            }
        }

        renderFrame();

    }



    createPlayerElements() {
        this.audioElem = document.createElement('audio'); 
        const playListElem = document.createElement('div');
        playListElem.classList.add('playlist');

        this.visualiserElem = document.createElement('canvas')


        this.playerElem.appendChild(this.audioElem);
        this.playerElem.appendChild(playListElem);
        this.playerElem.appendChild(this.visualiserElem)
        this.createPlaylistElements(playListElem)
    }

    createPlaylistElements(playListElem) {
        this.audio.forEach(audio => {
            const audioItem = document.createElement('a');
            const audioArtist = document.createElement('a')
            const audioDiv = document.createElement('div')
            const nowPlayin = document.createElement('div')

            audioDiv.classList.add("track-information")
            nowPlayin.classList.add("now-playin")

            if (this.currentAudio !== null) {
                // console.log("test true")
                nowPlayin.innerHTML = `Now Playing: ${this.currentAudio.name} - ${this.currentAudio.artist}`
            }

            // nowPlayin.innerHTML = `Now Playing: ${audio.name} - ${audio.artist}`


            audioDiv.appendChild(audioItem)
            audioDiv.appendChild(audioArtist)

            audioItem.href = audio.url;
            audioItem.innerHTML = `<i class= "fa fa-play"></i> ${audio.name}`;
            audioArtist.innerHTML = `${audio.artist}`;
            this.setupEventListener(audioDiv, audioItem);
            playListElem.appendChild(audioDiv);
            playListElem.appendChild(nowPlayin);

        })
    }

    setupEventListener(audioDiv, audioItem) {
        audioDiv.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.audioContext) {
                this.createVisualizer();
            }

            const isCurrentAudio = audioItem.getAttribute('href') === (this.currentAudio && this.currentAudio.getAttribute('href'))
        
            if (isCurrentAudio && !this.audioElem.paused) {
                this.setPlayIcon(this.currentAudio);
                this.audioElem.pause();
            } else if (isCurrentAudio && this.audioElem.paused) {
                this.setPauseIcon(this.currentAudio);
                this.audioElem.play();
            } else {
                if (this.currentAudio) {
                    this.setPlayIcon(this.currentAudio);
                }
                this.currentAudio = audioItem;
                this.setPauseIcon(this.currentAudio);
                this.audioElem.src = this.currentAudio.getAttribute('href');
                this.audioElem.play();
            }
        })
    }

    createSlider(r) {
        const slider = document.createElement(`input`)
        slider.setAttribute("type", "range")
        slider.setAttribute("min", "0")
        slider.setAttribute("max", "100")
        slider.setAttribute("value", "0")
    }



    setPlayIcon(elem) {
        const icon = elem.querySelector('i');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }

    setPauseIcon(elem) {
        const icon = elem.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }


}

