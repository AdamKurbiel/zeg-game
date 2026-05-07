import { TEXTURES } from "./renderer.js";

const HUD_POSITIONS = {
    heart : [10,10],
    reset_button: [240,10],
    inventory: [10,50],
    inventory_slots : [60,120]
};

const INVENTORY_MAX_SLOTS = 3;
const INVENTORY_ITEM_NAMES = {
    0: "Empty"
};


class Button { //PRZYCISK
 constructor(text,fillColor,textColor){
    this.text = text;
    this.fillColor = fillColor;
    this.textColor = textColor;
 }
 
 setPosition(x,y){
    this.x = x;
    this.y = y;
 }

 setSize(width,height){
    this.width = width;
    this.height = height;
 }

 draw(ctx){
    ctx.fillStyle = this.fillColor;
    ctx.fillRect(this.x,this.y,this.width,this.height);

    ctx.fillStyle = this.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '25px arial';
    ctx.fillText(this.text,this.x + this.width / 2, this.y + this.height / 2, this.width);
 }

};

const resetButton = new Button("Retry level","#cc3471","white");
resetButton.setPosition(HUD_POSITIONS.reset_button[0],HUD_POSITIONS.reset_button[1]);
resetButton.setSize(150,60);

export function checkResetBtn_click(x,y,player,map){
    if (
        x >= resetButton.x &&
        x <= resetButton.x + resetButton.width &&
        y >= resetButton.y &&
        y <= resetButton.y + resetButton.height
    ){
        player.health = 3;
        map.loadLevel(map.level);
        player.resetPosition(map)
        player.paused = false;
    }
}


function drawHeartCounter(statsCtx,health){
    statsCtx.drawImage(
        TEXTURES.HEART,
        HUD_POSITIONS.heart[0],
        HUD_POSITIONS.heart[1],
        64,
        64
    );
    
    statsCtx.fillStyle = "#cc3471";
    statsCtx.font = "48px arial";
    statsCtx.fillText(health,HUD_POSITIONS.heart[0]+90 ,HUD_POSITIONS.heart[1]+37);
}

function drawInventory(statsCtx,player){
    //funkcja do rysowania przedmiotów ekwipunku
    let slots = player.inventory;
    if (slots.length < 1 || slots.length > INVENTORY_MAX_SLOTS) return;

    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++){
        statsCtx.drawImage(
            TEXTURES.INVENTORY_SLOT,
            HUD_POSITIONS.inventory_slots[0] + i*100,
            HUD_POSITIONS.inventory_slots[1],
            80,
            80
        );
    }

/*
    for (let i of slots){//rysujemy każdy przedmiot po kolei
        console.log(INVENTORY_ITEM_NAMES[i]);
    }
*/


}


export function renderHud(statsCtx,player,width,height){
    statsCtx.fillStyle = "#2B1A4F";
    statsCtx.fillRect(0,0,width,height);

    drawHeartCounter(statsCtx, player.health);
    resetButton.draw(statsCtx);
    drawInventory(statsCtx,player);


    
    
}