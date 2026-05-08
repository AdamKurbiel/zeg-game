export class AudioSystem{
    constructor(){
        this.music,
        this.volume = 1.0
    }

    playMusic(url,volume){
        this.music = this.loadAudio(url);
        this.music.volume = volume;
        this.music.loop = true;
        this.autoplay
        this.music.play();
    }

    loadAudio(url){
        return new Audio(url);
    }
}