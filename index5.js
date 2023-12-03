
const stack = []

let gramatica = {
    structures:[
        {   nextState:'S', regexp:/^(int|string|boolean)$/,  error: "estructura no definida1111", value: 'S' , terminal: false},
        {   nextState:'V', regexp:/^func/, error: "error en declaración de estructura", value: 'V' , terminal: false},
        {   nextState:'W', regexp:/^if/, error: "error en declaración de estructura", value: 'W' , terminal: false},
        {   nextState:'AP', regexp:/^for/, error: "error en declaración de estructura", value: 'AP' , terminal: false},
        {   regexp:/^/, error: "estructura no definida", value: 'error' , terminal: false},
    ],
    S: [
        {   nextState:'A', regexp:/^int/, error: "error en declaración de estructura", value: ['B','A'] , terminal: false,length:3},
        {   nextState:'CC', regexp:/^string/, error: "error en declaración de estructura", value: ['CD','CC'], terminal: false,length:6},
        {   nextState:'CA', regexp:/^boolean/, error: "error en declaración de estructura", value: ['CB','CA'] , terminal: false,length:7},
        ],
    A: [
        {   nextState: "B", regexp: /^/ ,error: "error en nombre",value: ['CB','CA'], terminal:true   },
    ],
    B: [
        {   nextState: "C", error: "error en nombre",value: ['D','C'], terminal:false   },
    ],
    C: [
        {   nextState: "LE", error: "error en nombre",value: ['RL','LE'],  terminal:true },
    ],
    LE: [
        {   nextState: "RL",regexp: /^[A-Za-z]/, error: "error en nombre", terminal:false   }
    ],
    RL: [
    {   nextState: "LE", error: "error en nombre", terminal:false   }
    ],
    "q5": [
        {
            nextState: "q6",
            rule: /^-$/,
            error: "error-q5"
        }
    ],
    "q6": [
        {
            nextState: "q7",
            rule: /^0$/,
            error: "error-q6"
        },
        {
            nextState: "q8",
            rule: /^1$/,
            error: "error-q6"
        }
    ],
    "q7": [
        {
            nextState: "q9",
            rule: /^0$/,
            error: "error-q7"
        },
        {
            nextState: "q10",
            rule: /^[1-9]$/,
            error: "error-q7"
        }
    ],
    "q8": [
        {
            nextState: "q13",
            rule: /^[0-9]$/,
            error: "error-q8"
        }
    ],
    "q9": [
        {
            nextState: "q11",
            rule: /^[1-9]$/,
            error: "error-q9"
        }
    ],
    "q10": [
        {
            nextState: "q15",
            rule: /^[0-9]$/,
            error: "error-q10"
        }
    ],
    "q11": [
        {
            nextState: "q15",
            rule: /^-$/,
            error: "error-11"
        }
    ],
    "q12": [
        {
            nextState: "q15",
            rule: /^-$/,
            error: "error-q12"
        }
    ],
    "q13": [
        {
            nextState: "q14",
            rule: /^[0-9]$/,
            error: "error-q13"
        }
    ],
    "q14": [
        {
            nextState: "q15",
            rule: /^-$/,
            error: "error-q14"
        }
    ],
    "q15": [
        {
            nextState: "q16",
            rule: /^[a-z]$/,
            error: "error-q15"
        }
    ],
}

function getStructure(resultado){
    const structures = resultado.slice(0, resultado.indexOf(" "));
    const first = structures.join("")

    for (const estructura of gramatica.structures) {

        if(estructura.regexp.test(first)&& estructura.hasOwnProperty('nextState')){
            
            return [estructura.nextState,first]
        }
        
    }
    const err = gramatica.structures[gramatica.structures.length - 1]
    
    return err
    

}


function getNewState(){


}


const validateString = () => {
    

    const cadena = "int variable = 1;";
    const resultado = cadena.split("");

    [state,struct] = getStructure(resultado)
    
    stack.push(state)
    let index = 0;
    let newCadena = []
    newCadena.push(struct)
    for(let i = struct.length; i<resultado.length; i++){
        newCadena.push(resultado[i])
    }
    console.log(newCadena)

    if (state.value !== "error"){
        
        const newState = getNewState(state)



    /*
    for (let i = 0; i < resultado.length; i++) {
        const span = document.createElement('span');
        let letra = resultado[i]
        
        
        state = charValidate(letra, state)
        stateError= state==undefined ? "error-no" : state
        console.log(state)

        if (state == undefined || stateError[0] == "error") {
            span.textContent = letra;
            
            setTimeout(() => {
                span.style.backgroundColor = 'red';
            }, i * 500);
            console.log('no chido'+ i+state )
            return
        } else {
            span.textContent = letra;
            console.log("chido" + i + state)
            setTimeout(() => {
                span.style.backgroundColor = 'lightgreen';
            }, i * 500);
        }
        

    }*/
}
console.log(state.error)
    
}

function charValidate(char, currentState) {
    if (char) {
        if (gramatica[currentState] && gramatica[currentState].length > 0) {
            for (let state of gramatica[currentState]) {
                if (state.hasOwnProperty('regexp')){

                
                if (state.regexp.test(char)) {
                    console.log(state)
                    return state.nextState;
                }
            }

            }
            return gramatica[currentState].error
        }
    }
}


function analyze() {
    let inputPointer = 0;
    
    console.log(this.stack,this.input)
    while (this.stack.length > 0) {
    
    const stackTop = this.stack[this.stack.length - 1];
    const currentSymbol = this.input[inputPointer];
    if (stackTop === currentSymbol) {
        // Coincidencia, extraer de la pila y avanzar en la entrada
        this.stack.pop();
        inputPointer++;
    } else {
        // Error: Los símbolos no coinciden
        console.error('Error de sintaxis');
        return false;
    }
    }

    // La entrada ha sido completamente analizada
    console.log('Análisis sintáctico exitoso');
    return true;
}


validateString()