//ten skrypt odpowiada za koordynowanie wszystkimi bytami w grze.
import { Bat } from "../entities/bat.js";

//indeks bytów wraz z informacjami o nich
const ENTITY_INDEX = {
    "<" : {
        Name : "Bat",
        Frames : ["BAT0","BAT1"], //klatki animacji
        
        //możliwość zmiany szerokości/wysokości i koordynatów renderowanej tekstury bytu
        WidthScale : 1, 
        HeightScale : 0.9,
        YOffset : 0,
        XOffset : 0,
        
    },
}

//Sprawdzenie, czy podany znak z mapy to jakiś byt.
export function isEntity(type){
    if (ENTITY_INDEX[type] == undefined){
        return false;
    }else{
        return true;
    }
}


export class EntityHandler{
    constructor(){
        this.entities = [], //lista z wszystkimi aktualnymi bytami
        this.move_delay = 100 //opóźnienie między aktualizacjami bytó
    }

    //usuwanie bytów z mapy w przypadku czyszczenia
    clear(map){
        for (let entity of this.entities){
            entity.panic(map)
        }
        this.entities = [];
    }

    //aktualizacja wszystkich bytów
    update(map, now, move_delay){
        for (let entity of this.entities){
            entity.update(map,now,this.move_delay);
        }
    }

    //dodanie nowego bytu
    addEntity(type,y,x){
        if (type == "<"){
            var bat = new Bat(x,y);
            this.entities.push(bat);
        }        
    }

    //zdobycie informacji z ENTITY_INDEX na podstawie konkretnego typu
    getEntityInfo(type){
        return ENTITY_INDEX[type];
    }
}
