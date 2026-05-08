export class AudioSystem{
    constructor(){
        this.music,
        this.sfx
    }

    playMusic(url,volume){
        this.music = this.loadAudio(url);
        this.music.volume = volume;
        this.music.loop = true;
        this.autoplay
        this.music.play();
    }

    playSfx(url,volume){
        this.sfx = this.loadAudio(url);
        this.sfx.volume = volume;
        this.sfx.play();
    }

    loadAudio(url){
        return new Audio(url);
    }
}