export function createKeyboard() {
    const KEYS = { w:false, a:false, s:false, d:false};

    document.addEventListener("keydown", (event) =>{//KONTROLA
        const key = event.key.toLowerCase();
    
        if (key in KEYS){
            KEYS[key] = true;
            event.preventDefault();
        }
    });
    
    document.addEventListener("keyup",(event) =>{
        const key = event.key.toLowerCase();
    
        if (key in KEYS){
            KEYS[key] = false;
            event.preventDefault();
        }
    })

    return KEYS;
}