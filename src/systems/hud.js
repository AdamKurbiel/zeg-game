import { TEXTURES } from "./renderer.js";

const HUD_POSITIONS = {
    heart : [10,10],
    reset_button: [240,10],
    inventory: [10,50],
    inventory_slots : [60,120]
};

const INVENTORY_MAX_SLOTS = 3;
const INVENTORY_SLOT_SIZE = 80;
const INVENTORY_ITEM_NAMES = {
    0: "Empty"
};

var tooltip = {
    title : "",
    desc : "",

    xPosition : 0,
    yPosition : 0,

    enabled : false,
}

function lerp (start, end, t){
    return start * (1 - t) + end * t;
}

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

export function checkSlots_hover(x,y,statsCtx){
    
    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++){
        let slot_x = HUD_POSITIONS.inventory_slots[0] + i*100;
        let slot_y = HUD_POSITIONS.inventory_slots[1];
        let slot_wh = INVENTORY_SLOT_SIZE;

        if (
            x >= slot_x &&
            x <= slot_x + slot_wh &&
            y >= slot_y &&
            y <= slot_y + slot_wh
        ){
            
            tooltip.title = i;
            tooltip.desc = `Touching slot ${i}.`
            tooltip.xPosition = x,
            tooltip.yPosition = y,
            tooltip.enabled = true
            return;
        }
    }
    tooltip.enabled = false;
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
    statsCtx.textAlign = "center";
    statsCtx.fillText(health,HUD_POSITIONS.heart[0]+90 ,HUD_POSITIONS.heart[1]+37);
}

function drawTooltip(statsCtx,width,height){
    if (tooltip.enabled == false){     
        return;
    };

    let SIZE_X = 200;
    let SIZE_Y = 100;
    let POS_X = tooltip.xPosition;
    let POS_Y = tooltip.yPosition - 100;
    let OFFSET_X = 5;

    let title = tooltip.title;
    let description = tooltip.desc;


    if (POS_X + SIZE_X > width - OFFSET_X){
        POS_X = width - SIZE_X - OFFSET_X;
    }

    //ustawienia
    statsCtx.fillStyle = "Black";
    statsCtx.strokeStyle = "Pink";
    statsCtx.lineWidth = 5;
    
    statsCtx.strokeRect(POS_X,POS_Y,SIZE_X,SIZE_Y);

    //Tytuł
    statsCtx.globalAlpha = 0.6;
    statsCtx.fillRect(POS_X,POS_Y,SIZE_X,SIZE_Y);
    statsCtx.globalAlpha = 1.0;

    statsCtx.textAlign = "left";
    statsCtx.fillStyle = "White";
    statsCtx.font = "Bold 20px arial";
    statsCtx.fillText(tooltip.title,POS_X+5,POS_Y+16)

    //Opis
    statsCtx.fillStyle = "White";
    statsCtx.font = "12px arial";
    statsCtx.fillText(tooltip.desc,POS_X+5,POS_Y+36)



}

function drawInventory(statsCtx,player){
    //funkcja do rysowania przedmiotów ekwipunku
    let slots = player.inventory;
    if (slots.length > INVENTORY_MAX_SLOTS) return;

    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++){
        statsCtx.drawImage(
            TEXTURES.INVENTORY_SLOT,
            HUD_POSITIONS.inventory_slots[0] + i*100,
            HUD_POSITIONS.inventory_slots[1],
            INVENTORY_SLOT_SIZE,
            INVENTORY_SLOT_SIZE
        );
    }

/*
    for (let i of slots){//rysujemy każdy przedmiot po kolei
        console.log(INVENTORY_ITEM_NAMES[i]);
    }
*/


}

const resetButton = new Button("Retry level","#cc3471","white");
resetButton.setPosition(HUD_POSITIONS.reset_button[0],HUD_POSITIONS.reset_button[1]);
resetButton.setSize(150,60);

export function renderHud(statsCtx,player,width,height){
    statsCtx.fillStyle = "#2B1A4F";
    statsCtx.fillRect(0,0,width,height);

    drawHeartCounter(statsCtx, player.health);
    resetButton.draw(statsCtx);
    drawInventory(statsCtx,player);

    drawTooltip(statsCtx, width, height)
    

}