import { Player } from "../entities/player.js";
import { TEXTURES } from "./renderer.js";
import { ITEM_DICT, ITEM_RARITY_DICT } from "./itemInfo.js";

const HUD_POSITIONS = {
    heart : [20,10],
    reset_button: [190,85],
    inventory_slots : [60,180],
    level_info: [280,50]
};

const INVENTORY_MAX_SLOTS = 3;
const INVENTORY_SLOT_SIZE = 80;
const INVENTORY_ITEM_NAMES = {
    0: "Empty"
};

var tooltip = {
    title : "",
    desc : "",

    rarity : 0,
    xPosition : 0,
    yPosition : 0,

    enabled : false,
}

function lerp (start, end, t){
    return start * (1 - t) + end * t;
}

class Button { //PRZYCISK
constructor(text,fillColor,textColor,strokeColor){
    this.text = text;
    this.fillColor = fillColor;
    this.textColor = textColor;
    this.strokeColor = strokeColor;
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
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 5;
    ctx.strokeRect(this.x,this.y,this.width,this.height);

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
        player.inventory = [];
        map.loadLevel(map.level);
        player.resetPosition(map)
        player.paused = false;
    }
}

export function checkHudHover(x,y,statsCtx,player){
    //BUTTON HOVER


    //INVENTORY SLOTS HOVER
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
            if (player.inventory[i] == undefined){
                tooltip.title = ITEM_DICT[0].Title;
                tooltip.desc = ITEM_DICT[0].Description;
                tooltip.rarity = 0;
            }else{
                tooltip.title = ITEM_DICT[player.inventory[i]].Title;
                tooltip.desc = ITEM_DICT[player.inventory[i]].Description;
                tooltip.rarity = ITEM_DICT[player.inventory[i]].Rarity;
            }
            
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
        128,
        128
    );
    
    statsCtx.fillStyle = "#fff8fc";
    statsCtx.font = "48px arial";
    statsCtx.textAlign = "center";
    statsCtx.fillText(health,HUD_POSITIONS.heart[0]+60 ,HUD_POSITIONS.heart[1]+75);
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
    let description = tooltip.desc.split("\n");


    if (POS_X + SIZE_X > width - OFFSET_X){
        POS_X = width - SIZE_X - OFFSET_X;
    }

    //Ustawienia
    statsCtx.fillStyle = "Black";
    statsCtx.strokeStyle = "Pink";
    statsCtx.lineWidth = 5;
    
    //Główny prostokąt
    statsCtx.strokeRect(POS_X,POS_Y,SIZE_X,SIZE_Y);
    statsCtx.globalAlpha = 0.6;
    statsCtx.fillRect(POS_X,POS_Y,SIZE_X,SIZE_Y);
    statsCtx.globalAlpha = 1.0;

    //Tytuł
    statsCtx.textAlign = "left";
    statsCtx.fillStyle = ITEM_RARITY_DICT[tooltip.rarity].Color;
    statsCtx.font = "Bold 20px arial";
    statsCtx.fillText(title,POS_X+5,POS_Y+16);

    //Opis
    for (let i = 0; i < description.length; i++){
        statsCtx.fillStyle = "White";
        statsCtx.font = "12px arial";
        statsCtx.fillText(description[i],POS_X+5,POS_Y+36+(i*18));
    }
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

        if (player.inventory[i] != undefined && player.inventory[i] != 0){
            statsCtx.globalAlpha = 0.8;
            statsCtx.drawImage(
                TEXTURES[player.inventory[i]],
                HUD_POSITIONS.inventory_slots[0] + i*100+10,
                HUD_POSITIONS.inventory_slots[1] + 10,
                INVENTORY_SLOT_SIZE * 0.75,
                INVENTORY_SLOT_SIZE * 0.75
            )
            statsCtx.globalAlpha = 1;
        }
    }
}

function drawLevelInfo(statsCtx,map){
    statsCtx.fillStyle = "White";
    statsCtx.textAlign = "center";
    statsCtx.font = "bold 30px arial";
    statsCtx.fillText(`Poziom ${map.level}`,HUD_POSITIONS.level_info[0],HUD_POSITIONS.level_info[1]);
}

const resetButton = new Button("Zresetuj","#b4225c","white","#a21c52");
resetButton.setPosition(HUD_POSITIONS.reset_button[0],HUD_POSITIONS.reset_button[1]);
resetButton.setSize(180,40);

export function renderHud(statsCtx,player,width,height,map){
    statsCtx.fillStyle = "#2B1A4F";
    statsCtx.fillRect(0,0,width,height);

    drawHeartCounter(statsCtx, player.health);
    resetButton.draw(statsCtx);
    drawLevelInfo(statsCtx,map);

    drawInventory(statsCtx,player);

    drawTooltip(statsCtx, width, height)

    statsCtx.strokeStyle = "Black";
    statsCtx.lineWidth = 10;
    statsCtx.strokeRect(0,0,width,height);
}