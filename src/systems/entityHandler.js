import { Bat } from "../entities/bat.js";

const ENTITY_INDEX = {
    "<" : {
        Name : "Bat",
        Frames : ["BAT0","BAT1"],
        WidthScale : 1,
        HeightScale : 0.9,
        YOffset = 0,
        XOffset = 0,
        
    },
}


export function isEntity(type){
    if (ENTITY_INDEX[type] == undefined){
        return false;
    }else{
        return true;
    }
}

export class EntityHandler{
    constructor(){
        this.entities = [],
        this.move_delay = 100
    }

    clear(map){
        for (let entity of this.entities){
            entity.panic(map)
        }
        this.entities = [];
    }

    update(map, now, move_delay){
        for (let entity of this.entities){
            entity.update(map,now,this.move_delay);
        }
    }

    addEntity(type,y,x){
        if (type == "<"){
            var bat = new Bat(x,y);
            this.entities.push(bat);
        }        
    }
    
    getEntityInfo(type){
        return ENTITY_INDEX[type];
    }
}