import { Player } from "../entities/player.js";
import { TEXTURES } from "./renderer.js";
import { ITEM_DICT, ITEM_RARITY_DICT } from "./itemInfo.js";
import { activatePowder } from "./vignette.js";
import { restartLevel } from "../core/game.js";
import { FONTNAMES } from "../core/main.js";
import { notes } from "../world/maps.js";

const HUD_POSITIONS = {
    heart : [20,10],
    reset_button: [190,85],
    inventory_slots : [40, 192],
    inventory_border : [0,160],
    level_info: [280,50],
    authors: [200,680]
};

const INVENTORY_MAX_SLOTS = 6;
const INVENTORY_SLOT_SIZE = 90;
const INVENTORY_ITEM_NAMES = {
    0: "Empty"
};

var slotHover = {
    0 : false,
    1 : false,
    2 : false,
    3 : false,
    4 : false,
    5 : false,
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

const NOTE_SLOT_SIZE = 64;
const NOTE_PAD = 15;
const NOTE_START_Y = 80;

var hoveredNoteIndex = -1;

export function checkNotesHover(x, y, player) {
    hoveredNoteIndex = -1;
    for (let i = 0; i < player.collectedNotes.length; i++) {
        let sy = NOTE_START_Y + i * (NOTE_SLOT_SIZE + NOTE_PAD);
        if (x >= NOTE_PAD && x <= NOTE_PAD + NOTE_SLOT_SIZE &&
            y >= sy && y <= sy + NOTE_SLOT_SIZE) {
            hoveredNoteIndex = i;
            break;
        }
    }
}

export function checkNotesClick(x, y, player) {
    for (let i = 0; i < player.collectedNotes.length; i++) {
        let sy = NOTE_START_Y + i * (NOTE_SLOT_SIZE + NOTE_PAD);
        if (x >= NOTE_PAD && x <= NOTE_PAD + NOTE_SLOT_SIZE &&
            y >= sy && y <= sy + NOTE_SLOT_SIZE) {
            player.currentNote = player.collectedNotes[i];
            player.paused = true;
            break;
        }
    }
}

export function renderNotes(notesCtx, width, height, player) {
    notesCtx.fillStyle = "#2B1A4F";
    notesCtx.fillRect(0, 0, width, height);
    notesCtx.strokeStyle = "black";
    notesCtx.lineWidth = 10;
    notesCtx.strokeRect(0, 0, width, height);

    notesCtx.fillStyle = "white";
    notesCtx.font = `28px ${FONTNAMES[0]}`;
    notesCtx.textAlign = "center";
    notesCtx.fillText("Notatki", width / 2, 45);

    notesCtx.strokeStyle = "#7a4bbf";
    notesCtx.lineWidth = 2;
    notesCtx.beginPath();
    notesCtx.moveTo(NOTE_PAD, 58);
    notesCtx.lineTo(width - NOTE_PAD, 58);
    notesCtx.stroke();

    if (player.collectedNotes.length === 0) {
        notesCtx.fillStyle = "#7a4bbf";
        notesCtx.font = `16px ${FONTNAMES[1]}`;
        notesCtx.textAlign = "center";
        notesCtx.fillText("Brak notatek.", width / 2, NOTE_START_Y + 30);
        return;
    }

    for (let i = 0; i < player.collectedNotes.length; i++) {
        let sy = NOTE_START_Y + i * (NOTE_SLOT_SIZE + NOTE_PAD);
        let isHovered = hoveredNoteIndex === i;

        notesCtx.fillStyle = isHovered ? "#5a2f90" : "#3d2066";
        notesCtx.strokeStyle = isHovered ? "#d4aaff" : "#7a4bbf";
        notesCtx.lineWidth = 3;
        notesCtx.fillRect(NOTE_PAD, sy, NOTE_SLOT_SIZE, NOTE_SLOT_SIZE);
        notesCtx.strokeRect(NOTE_PAD, sy, NOTE_SLOT_SIZE, NOTE_SLOT_SIZE);

        notesCtx.globalAlpha = 0.9;
        notesCtx.drawImage(TEXTURES.PAPERNOTES, NOTE_PAD + 8, sy + 8, NOTE_SLOT_SIZE - 16, NOTE_SLOT_SIZE - 16);
        notesCtx.globalAlpha = 1;

        notesCtx.fillStyle = isHovered ? "#d4aaff" : "white";
        notesCtx.font = `17px ${FONTNAMES[0]}`;
        notesCtx.textAlign = "left";
        notesCtx.fillText(`Notatka #${player.collectedNotes[i]}`, NOTE_PAD + NOTE_SLOT_SIZE + 10, sy + 26);

        notesCtx.fillStyle = "#aaaaaa";
        notesCtx.font = `13px ${FONTNAMES[1]}`;
        let preview = (notes[player.collectedNotes[i]] || "").split("\n")[0];
        if (preview.length > 14) preview = preview.slice(0, 14) + "…";
        notesCtx.fillText(preview, NOTE_PAD + NOTE_SLOT_SIZE + 10, sy + 48);

        if (isHovered) {
            let lines = (notes[player.collectedNotes[i]] || "Brak treści.").split("\n");
            let TW = width - NOTE_PAD * 2;
            let TH = 32 + lines.length * 20;
            let TX = NOTE_PAD;
            let TY = sy - TH - 8;
            if (TY < 65) TY = sy + NOTE_SLOT_SIZE + 8;

            notesCtx.globalAlpha = 0.88;
            notesCtx.fillStyle = "#1a0d33";
            notesCtx.fillRect(TX, TY, TW, TH);
            notesCtx.globalAlpha = 1;
            notesCtx.strokeStyle = "#d4aaff";
            notesCtx.lineWidth = 3;
            notesCtx.strokeRect(TX, TY, TW, TH);

            notesCtx.fillStyle = "#d4aaff";
            notesCtx.font = `17px ${FONTNAMES[0]}`;
            notesCtx.textAlign = "left";
            notesCtx.fillText(`Notatka #${player.collectedNotes[i]}`, TX + 8, TY + 20);

            for (let j = 0; j < lines.length; j++) {
                notesCtx.fillStyle = "white";
                notesCtx.font = `14px ${FONTNAMES[1]}`;
                notesCtx.fillText(lines[j], TX + 8, TY + 36 + j * 20);
            }
        }
    }
}

class Button {
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
    ctx.font = `25px ${FONTNAMES[0]}`;
    ctx.fillText(this.text,this.x + this.width / 2, this.y + this.height / 2, this.width);
}
};

var hudWidth = 370;

function getInventorySlotPos(i) {
    const GAP = 10;
    const slotSize = INVENTORY_SLOT_SIZE;
    const gridW = 3 * slotSize + 2 * GAP;
    const col = i % 3;
    const row = Math.floor(i / 3);
    const startX = (hudWidth - gridW) / 2;
    const startY = HUD_POSITIONS.inventory_border[1] + 20;
    return {
        x: startX + col * (slotSize + GAP),
        y: startY + row * (slotSize + GAP)
    };
}

export function checkHudClick(x,y,player,map,entityHandler,audioSystem){
    if (player.gameOver) return;

    if (
        x >= resetButton.x &&
        x <= resetButton.x + resetButton.width &&
        y >= resetButton.y &&
        y <= resetButton.y + resetButton.height
    ){
        restartLevel(player,entityHandler,map,false);
    }

    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++){
        const pos = getInventorySlotPos(i);
        if (
            x >= pos.x &&
            x <= pos.x + INVENTORY_SLOT_SIZE &&
            y >= pos.y &&
            y <= pos.y + INVENTORY_SLOT_SIZE
        ){
            var item = player.inventory[i];
            if (item == "BURGER"){
                player.deleteItem("BURGER");
                audioSystem.playSfx('assets/sounds/sfx/eat.mp3',0.25);
                player.immuneCooldown = temp_now;
                player.immune = true;
            }
            if (item == "MEDKIT"){
                player.deleteItem("MEDKIT");
                player.health += 3;
                audioSystem.playSfx('assets/sounds/sfx/heal.mp3', 0.35);
            }
            if (item == "CANDY"){
                player.deleteItem("CANDY");
                player.health += 2;
                audioSystem.playSfx('assets/sounds/sfx/heal.mp3', 0.35);
            }
            if (item == "SUSSY_POWDER"){
                player.deleteItem("SUSSY_POWDER");
                player.health += 5;
                activatePowder(temp_now);
                audioSystem.playSfx('assets/sounds/sfx/heal.mp3', 0.35);
            }
            return;
        }
    }
}

export function checkHudHover(x,y,statsCtx,player,audioSystem){
    if (player.gameOver) return;

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

    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++){
        const pos = getInventorySlotPos(i);
        if (
            x >= pos.x &&
            x <= pos.x + INVENTORY_SLOT_SIZE &&
            y >= pos.y &&
            y <= pos.y + INVENTORY_SLOT_SIZE
        ){
            if (player.inventory[i] == undefined){
                tooltip.title = ITEM_DICT[0].Title;
                tooltip.desc = ITEM_DICT[0].Description;
                tooltip.rarity = 0;
            }else{
                if (slotHover[i] == false){
                    audioSystem.playSfx('assets/sounds/sfx/blip.mp3',0.25);
                }
                slotHover[i] = true;
                tooltip.title = ITEM_DICT[player.inventory[i]].Title;
                tooltip.desc = ITEM_DICT[player.inventory[i]].Description;
                tooltip.rarity = ITEM_DICT[player.inventory[i]].Rarity;
            }
            tooltip.xPosition = x;
            tooltip.yPosition = y;
            tooltip.enabled = true;
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
    statsCtx.font = `68px ${FONTNAMES[1]}`;
    statsCtx.textAlign = "center";
    statsCtx.fillText(health,HUD_POSITIONS.heart[0]+63 ,HUD_POSITIONS.heart[1]+75);
}

function drawTooltip(statsCtx,width,height){
    if (tooltip.enabled == false) return;

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

    statsCtx.fillStyle = "Black";
    statsCtx.strokeStyle = "Pink";
    statsCtx.lineWidth = 5;
    statsCtx.strokeRect(POS_X,POS_Y,SIZE_X,SIZE_Y);
    statsCtx.globalAlpha = 0.6;
    statsCtx.fillRect(POS_X,POS_Y,SIZE_X,SIZE_Y);
    statsCtx.globalAlpha = 1.0;

    statsCtx.textAlign = "left";
    statsCtx.fillStyle = ITEM_RARITY_DICT[tooltip.rarity].Color;
    statsCtx.font = `28px ${FONTNAMES[0]}`;
    statsCtx.fillText(title,POS_X+5,POS_Y+16);

    for (let i = 0; i < description.length; i++){
        statsCtx.fillStyle = "White";
        statsCtx.font = `16px ${FONTNAMES[1]}`;
        statsCtx.fillText(description[i],POS_X+5,POS_Y+36+(i*18));
    }
}

function drawInventory(statsCtx, player, width) {
    let slots = player.inventory;
    if (slots.length > INVENTORY_MAX_SLOTS) return;

    const GAP = 10;
    const slotSize = INVENTORY_SLOT_SIZE;
    const gridW = 3 * slotSize + 2 * GAP;
    const gridH = 2 * slotSize + GAP;
    const startX = (width - gridW) / 2;
    const startY = HUD_POSITIONS.inventory_border[1] + 20;

    statsCtx.lineWidth = 4;
    statsCtx.strokeStyle = "black";
    statsCtx.strokeRect(startX - 60, startY - 8, gridW + 120, gridH + 16);

    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const slot_x = startX + col * (slotSize + GAP);
        const slot_y = startY + row * (slotSize + GAP);

        statsCtx.drawImage(TEXTURES.INVENTORY_SLOT, slot_x, slot_y, slotSize, slotSize);

        if (player.inventory[i] != undefined && player.inventory[i] != 0) {
            statsCtx.globalAlpha = 0.8;
            var SLOT_SIZE_DRAW = slotSize * 0.75;
            let off_x = 0, off_y = 0;
            if (slotHover[i]) { SLOT_SIZE_DRAW = slotSize * 0.80; off_x = -1; off_y = -1; }
            statsCtx.drawImage(TEXTURES[player.inventory[i]], slot_x + 10 + off_x, slot_y + 10 + off_y, SLOT_SIZE_DRAW, SLOT_SIZE_DRAW);
            statsCtx.globalAlpha = 1;
        }
    }
}

function drawLevelInfo(statsCtx,map){
    statsCtx.fillStyle = "White";
    statsCtx.textAlign = "center";
    statsCtx.font = `48px ${FONTNAMES[0]}`;
    statsCtx.fillText(`Poziom ${map.level}`,HUD_POSITIONS.level_info[0]+5,HUD_POSITIONS.level_info[1]);
}

function drawAuthors(statsCtx){
    statsCtx.fillStyle = "White";
    statsCtx.font = `15px ${FONTNAMES[0]}`;
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
    hudWidth = width;
    statsCtx.fillStyle = "#2B1A4F";
    statsCtx.fillRect(0,0,width,height);

    statsCtx.strokeStyle = "Black";
    statsCtx.lineWidth = 10;
    statsCtx.strokeRect(0,0,width,height);
    if (player.gameOver) return;

    drawHeartCounter(statsCtx, player.health);
    resetButton.draw(statsCtx);
    drawLevelInfo(statsCtx,map);
    drawInventory(statsCtx,player,width);
    drawTooltip(statsCtx, width, height);
    drawAuthors(statsCtx);
}