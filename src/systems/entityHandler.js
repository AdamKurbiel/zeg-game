import { Teacher } from "../entities/teacher.js";

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

    addEntity(type,x,y){
        if (type == "<"){
            var teacher = new Teacher(type,x,y);
            this.entities.push(teacher);
        }        
    }
}