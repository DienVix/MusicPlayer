const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const playlist = $('.playlist')
const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [

        {
            name: 'Little do you know',
            author: 'Alex & Sierra',
            image: './asset/image/song1.jpg',
            path: './asset/music/nevada.mp3'
        },
        {
            name: 'When night falls',
            author: 'Eddi Kim',
            image: './asset/image/song2.jpg',
            path: './asset/music/ignite.mp3'
        },
        {
            name: 'Too late',
            author: 'Addie Nicole',
            image: './asset/image/song3.jpg',
            path: './asset/music/Monody.mp3'
        },
        {
            name: 'Versace',
            author: 'The Same Persons',
            image: './asset/image/song4.png',
            path: './asset/music/GiupAnhTraLoiNhungCauHoi.mp3'
        },
        {
            name: 'Set fire to the rain',
            author: 'Rain Adele ft. Vahn Remix',
            image: './asset/image/song5.jpg',
            path: './asset/music/XuanThi.mp3'
        },
        {
            name: 'Kiss Remix',
            author: 'Hung Bobi Remix',
            image: './asset/image/song6.jpg',
            path: './asset/music/Spectre.mp3'
        },
        {
            name: 'Trap Queen Remix',
            author: 'Adriana Gomez',
            image: './asset/image/song7.jfif',
            path: './asset/music/Unity.mp3'
        },
        {
            name: 'Devil From Heaven',
            author: 'TVT Remix',
            image: './asset/image/song8.jpg',
            path: './asset/music/Summertime.mp3'
        },
        {
            name: 'Cheap Thrills',
            author: 'Sia',
            image: './asset/image/song9.jpg',
            path: './asset/music/LacTroi.mp3'
        },
        {
            name: 'Let\'s marriage',
            author: 'Masew ft. Masiu',
            image: './asset/image/song10.jfif',
            path: './asset/music/DontBreakMyHeart.mp3'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.author}</</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() { 
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        // X??? l?? rotate cd
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 20000,
            interations: Infinity
        })
        console.log(cdThumbAnimate)
        cdThumbAnimate.pause()
        //x??? l?? ph??ng to thu nh??? cd
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY ||document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // x??? l?? khi click play
        playBtn.onclick = function() {
            if(app.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
            //khi song ???????c play
            audio.onplay = function() {
                app.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            //khi song ???????c paused
            audio.onpause = function() {
                app.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
            //khi ti???n ????? b??i h??t thay ?????i
            audio.ontimeupdate = function() {
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime /audio.duration * 100)
                    progress.value = progressPercent
                }
            }
            //x??? l?? khi Tua
            progress.onchange = function(e){
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
        }
        // X??? l?? khi next 
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        } 
        // X??? l?? khi prev 
        prevBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        } 
        // x??? l?? b???t/t???t random
        randomBtn.onclick = function(e){
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            randomBtn.classList.toggle('active', app.isRandom)
        }
        // X??? l?? repeat song
        repeatBtn.onclick = function(e){
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }
        // X??? l?? next song khi audio end
        audio.onended = function() {
            if(app.isRepeat){
                audio.play()
            } else{
            nextBtn.click()
            }
        }
        //l???ng nghe click v??o playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){ 
                // X??? l?? khi click v??o song
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    audio.play()
                    app.render()
                }
                //X??? l?? khi click v??o option
                if(e.target.closest('.option')){

                }
            }    
        }
    },
    loadCurrentSong: function() {
        heading.textContent  = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1 
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            },300)
        })
    },
    start: function(){
        // g??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig()

        // ?????nh ngh??a c??c thu???c t??nh cho obj
        this.defineProperties()

        //L???ng nghe / x??? l?? c??c s??? ki???n(DOM events)
        this.handleEvents()

        // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hi???n th??? tr???ng th??i ban ?????u c???a button repeat & random
        randomBtn.classList.toggle('active', app.isRandom)
        repeatBtn.classList.toggle('active', app.isRepeat)
    }
}
app.start()