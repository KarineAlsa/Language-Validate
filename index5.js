
const stack = ['$']
let terminal;
let gramatica = {
    structures:[
        {   nextState:'S', regexp:/^(int|string|boolean)$/,  error: "estructura no definida1111", value: 'S' , terminal: false},
        {   nextState:'V', regexp:/^func/, error: "error en declaración de estructura", value: 'V' , terminal: false},
        {   nextState:'W', regexp:/^if/, error: "error en declaración de estructura", value: 'W' , terminal: false},
        {   nextState:'AP', regexp:/^for/, error: "error en declaración de estructura", value: 'AP' , terminal: false},
        {   regexp:/^/, error: "estructura no definida", value: 'error' , terminal: false},
    ],
    S: [
        {   nextState:'A', regexp:/^int/, error: "error en declaración de estructura", value: ['B','A'] , terminal: false},
        {   nextState:'CC', regexp:/^string/, error: "error en declaración de estructura", value: ['CD','CC'], terminal: false},
        {   nextState:'CA', regexp:/^boolean/, error: "error en declaración de estructura", value: ['CB','CA'] , terminal: false},
        ],
    A: [
        {   nextState: "B", regexp: /^int/ ,error: "error en nombre",value: "int", terminal:true   },
    ],
    B: [
        {   nextState: "C", error: "error en nombre",value: ['D','C'], terminal:false   },
    ],
    C: [
        {   nextState: "LE", error: "error en nombre",value: ['RL','LE'],  terminal:false },
    ],
    LE: [
        {   nextState: "RL",regexp: /^/, error: "error en nombre",value:"a-z", terminal:true   }
    ],
    RL: [
    {   nextState: "LE", regexp : /^[A-Za-z]/,error: "error en nombre",value:['RL','LE'], terminal:false   },
    {   nextState: "DI", regexp : /^[0-9]/,error: "error en nombre",value:['RD','DI'], terminal:false   }
    ],
    CC: [
        {   nextState: "B", regexp: /^string/ ,error: "error en nombre",value: "string", terminal:true   },
    ],
    CA: [
        {   nextState: "B", regexp: /^boolean/ ,error: "error en nombre",value: "boolean", terminal:true   },
    ],
    CD: [
        {   nextState: "B", regexp: /^boolean/ ,error: "error en nombre",value: "boolean", terminal:true   },
    ],
}

function getStructure(resultado){
    const structures = resultado.slice(0, resultado.indexOf(" "));
    const first = structures.join("")

    for (const estructura of gramatica.structures) {

        if(estructura.regexp.test(first)&& estructura.hasOwnProperty('nextState')){
            terminal = estructura.terminal
            return [estructura.nextState,first]
        }
        
    }
    const err = gramatica.structures[gramatica.structures.length - 1]
    
    return [err,0]
    

}


function getNewState(statement,a){
    if(statement!==undefined){
    for (const estructura of gramatica[statement]){
        if(estructura.hasOwnProperty('regexp')){
            if(estructura.regexp.test(a)&& estructura.hasOwnProperty('nextState')){
                terminal = estructura.terminal
                
                return estructura.nextState
            }
        }
    }
}
}
function getProduction(statement,a) {
    if (gramatica.hasOwnProperty(statement)){
        
        
        if(statement =="S"){
            for (const estructura of gramatica.S){
                if(estructura.hasOwnProperty('regexp')){
                    if(estructura.regexp.test(a)&& estructura.hasOwnProperty('nextState')){
                        terminal = estructura.terminal
                        
                        return estructura.value
                    }
                }
            }

        }
        return gramatica[statement][0].value

    }
    return false
    
}

function getValue(statement,a) {

    if (gramatica.hasOwnProperty(statement)){

        if(statement =="S"){
            for (const estructura of gramatica.S){
                if(estructura.hasOwnProperty('regexp')){
                    if(estructura.regexp.test(a)&& estructura.hasOwnProperty('nextState')){
                        terminal = estructura.terminal
                        
                        return estructura.value
                    }
                }
            }

        }
        return gramatica[statement].value

    }
    return false
    
}
function getValueRefex(x,cadena) {

    for (const re of gramatica[x]) {
        
        const leMatch = cadena.match(re.regexp);
        return leMatch ? leMatch[0] : null;
    }
}


const validateString = () => {
    const cadena = "int variable =  1;";
    let resultado = cadena.split("");

    [state,struct] = getStructure(resultado)
    
    
    if (state.value !== "error"){
        stack.push(state)
        let newCadena = []
        newCadena.push(struct)
        resultado = resultado.map((char, index, array) => {
            if (char === ' ' && array[index + 1] === ' ') {
                return null; 
            }
            return char;
        }).filter(char => char !== null);
        
        resultado.join('');
        
        
        for(let i = struct.length; i<resultado.length; i++){
            newCadena.push(resultado[i])
        }
        
        
        let i =0;
        
        /* fueraaaaaa */
        let a = newCadena[0]
        console.log(stack)
        if (stack[stack.length-1] == "S"){
            let production = getProduction(state,a)

            stack.pop()
            Array.isArray(production) ? stack.push(...production) : stack.push(production)
        }
        console.log(stack)
        
        for( i =0; i< 2;i){
            let x=stack[stack.length -1]
            a = newCadena[i]
            
            if (isTerminal(x)){
                x = getValueRefex(x,a)
                stack.pop()
                console.log(x)
                stack.push(x)
                console.log(stack)
                if(x == a){
                    stack.pop()
                    i++
                }
                else{
                    throw new Error("nopis")
                }
            }
            else if(!isTerminal(x)){    
                stack.pop()               
                let production = getProduction(x)
                
                if(production==undefined){
                    throw new Error("nelpas")
                }
                    Array.isArray(production) ? stack.push(...production) : stack.push(production)

                
                
            }
            else if(isTerminal(x)=="algo"){
                break
            }
            

            
            
        }

}else{

    console.log(state.error)
}
    
}

function isTerminal(topecitllo){
    
    if(gramatica.hasOwnProperty(topecitllo)){
        for (const gram of gramatica[topecitllo]) {
            
            return gram.terminal
        }
        
    }else{
        
        return "algo"
    }
    
}



validateString()