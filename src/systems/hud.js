import { Player } from "../entities/player.js";
import { TEXTURES } from "./renderer.js";
import { ITEM_DICT, ITEM_RARITY_DICT } from "./itemInfo.js";
import { restartLevel } from "../core/game.js";
import { FONTNAME } from "../core/main.js";

const HUD_POSITIONS = {
    heart : [20,10],
    reset_button: [190,85],
    inventory_slots : [60,180],
    inventory_border : [0,160],
    level_info: [280,50],
    authors: [200,680]
};

const INVENTORY_MAX_SLOTS = 3;
const INVENTORY_SLOT_SIZE = 80;
const INVENTORY_ITEM_NAMES = {
    0: "Empty"
};
var slotHover = {
    0 : false,
    1 : false,
    2 : false
}

var temp_now

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
constructor(text,fillColor,textColor,strokeColor,hoverColor){
    this.text = text;
    this.fillColor = fillColor;
    this.hoverColor = hoverColor
    this.textColor = textColor;
    this.strokeColor = strokeColor;
    this.hover = false;
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
    if (this.hover) ctx.fillStyle = this.hoverColor;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 5;
    ctx.strokeRect(this.x,this.y,this.width,this.height);

    ctx.fillStyle = this.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `25px ${FONTNAME}`;
    ctx.fillText(this.text,this.x + this.width / 2, this.y + this.height / 2, this.width);
}
};

export function checkHudClick(x,y,player,map,entityHandler){
    if (player.gameOver) return;

    //RESET BUTTON
    if (
        x >= resetButton.x &&
        x <= resetButton.x + resetButton.width &&
        y >= resetButton.y &&
        y <= resetButton.y + resetButton.height
    ){
        restartLevel(player,entityHandler,map,false);
    }


    //INVENTORY SLOTS
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
            var item = player.inventory[i]
            if (item == "BURGER"){
                player.deleteItem("BURGER");
                player.immuneCooldown = temp_now;
                player.immune = true
            }

            return;
        }
    }
}

export function checkHudHover(x,y,statsCtx,player){

    if (player.gameOver) return;
    //RESET BUTTON
    if (
        x >= resetButton.x &&
        x <= resetButton.x + resetButton.width &&
        y >= resetButton.y &&
        y <= resetButton.y + resetButton.height
    ){
        resetButton.hover = true;
    }else{
        resetButton.hover = false;
    }


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
                slotHover[i] = true;
                tooltip.title = ITEM_DICT[player.inventory[i]].Title;
                tooltip.desc = ITEM_DICT[player.inventory[i]].Description;
                tooltip.rarity = ITEM_DICT[player.inventory[i]].Rarity;
            }
            
            tooltip.xPosition = x,
            tooltip.yPosition = y,
            tooltip.enabled = true
            return;
        }else{
            slotHover[i] = false;
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
    statsCtx.font = `64px ${FONTNAME}`;
    statsCtx.textAlign = "center";
    statsCtx.fillText(health,HUD_POSITIONS.heart[0]+62 ,HUD_POSITIONS.heart[1]+75);
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
    statsCtx.font = `28px ${FONTNAME}`;
    statsCtx.fillText(title,POS_X+5,POS_Y+16);

    //Opis
    for (let i = 0; i < description.length; i++){
        statsCtx.fillStyle = "White";
        statsCtx.font = `16px ${FONTNAME}`;
        statsCtx.fillText(description[i],POS_X+5,POS_Y+36+(i*18));
    }
}

function drawInventory(statsCtx,player){
    //funkcja do rysowania przedmiotów ekwipunku
    let slots = player.inventory;
    if (slots.length > INVENTORY_MAX_SLOTS) return;

    statsCtx.lineWidth = 4;
    statsCtx.strokeStyle = "black";
    statsCtx.strokeRect(HUD_POSITIONS.inventory_border[0],HUD_POSITIONS.inventory_border[1],400,120);

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
            var SLOT_SIZE = INVENTORY_SLOT_SIZE * 0.75;
            let off_x = 0;
            let off_y = 0;
            if (slotHover[i]) {
                SLOT_SIZE = INVENTORY_SLOT_SIZE * 0.80;
                off_x = -1;
                off_y = -1;
            }
            
            

            statsCtx.drawImage(
                TEXTURES[player.inventory[i]],
                HUD_POSITIONS.inventory_slots[0] + i*100+10+off_x,
                HUD_POSITIONS.inventory_slots[1] + 10+off_y,
                SLOT_SIZE,
                SLOT_SIZE
            )
            statsCtx.globalAlpha = 1;
        }
    }
}

function drawLevelInfo(statsCtx,map){
    statsCtx.fillStyle = "White";
    statsCtx.textAlign = "center";
    statsCtx.font = `60px ${FONTNAME}`;
    statsCtx.fillText(`Poziom ${map.level}`,HUD_POSITIONS.level_info[0],HUD_POSITIONS.level_info[1]);
}

function drawAuthors(statsCtx){
    statsCtx.fillStyle = "White";
    statsCtx.font = `18px ${FONTNAME}`;
    statsCtx.textAlign = "center"
    statsCtx.globalAlpha = 0.8;
    statsCtx.fillText("Stworzone przez Adam Kurbiel & Karina Bednarska (2026).",HUD_POSITIONS.authors[0],HUD_POSITIONS.authors[1]);
    statsCtx.globalAlpha = 1.0;
}

const resetButton = new Button("Zresetuj","#b4225c","white","#a21c52","#881644");
resetButton.setPosition(HUD_POSITIONS.reset_button[0],HUD_POSITIONS.reset_button[1]);
resetButton.setSize(180,40);

export function renderHud(statsCtx,player,width,height,map,now){
    temp_now = now;
    statsCtx.fillStyle = "#2B1A4F";
    statsCtx.fillRect(0,0,width,height);

    statsCtx.strokeStyle = "Black";
    statsCtx.lineWidth = 10;
    statsCtx.strokeRect(0,0,width,height);
    if (player.gameOver) return;


    drawHeartCounter(statsCtx, player.health);
    resetButton.draw(statsCtx);
    drawLevelInfo(statsCtx,map);

    drawInventory(statsCtx,player);

    drawTooltip(statsCtx, width, height)

    drawAuthors(statsCtx)
}