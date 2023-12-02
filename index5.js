
let gramatica = {
    S:[
        {   nextState:['A','B'],  error: "error en declaración de estructura", value: 'A' , terminal: false}
    ],
    A: [
        {   regex: /^int/,  error: "error en declaración de estructura", value: 'A' , terminal: true},
        ],
        B: [
        {   nextState: "C", error: "error en nombre", value: 'B', terminal:false   },
        {   nextState: "D", error: "error en nombre", value: 'A', terminal:false   }
        ],
        C: [
        {   nextState: "LE", error: "error en nombre", terminal:false   },
        {   nextState: "RL", error: "error en nombre", terminal:false   }
        ],
        LE: [
        {   regex: /^[a-zA-Z]/, nextState: "RL", error: "error en nombre",  terminal:true },
        ],
        IN: [
        {   nextState: "LE", error: "error en nombre", terminal:false   }
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

const validateString = () => {
    let state = "S"
    
    const prefijo = document.getElementById('prefijoInput').value;
    const numero = document.getElementById('numeroInput').value;
    const sufijo = document.getElementById('sufijoInput').value;
    const cadena = `${prefijo}-${numero}-${sufijo}`;
    const cadenaIluminada = document.getElementById('cadenaIluminada');
    const chars = cadena.split("")

    cadenaIluminada.innerHTML = '';
    for (let i = 0; i < chars.length; i++) {
        const span = document.createElement('span');
        let letra = chars[i]
        state = charValidate(letra, state)
        stateError= state==undefined ? "error-no".split("-") : state.split("-")

        if (state == undefined || stateError[0] == "error") {
            span.textContent = letra;
            cadenaIluminada.appendChild(span);
            setTimeout(() => {
                span.style.backgroundColor = 'red';
            }, i * 500);
            
            return
        } else {
            span.textContent = letra;
            cadenaIluminada.appendChild(span);
            setTimeout(() => {
                span.style.backgroundColor = 'lightgreen';
            }, i * 500);
        }

    }
    
}

function charValidate(char, currentState) {
    if (char) {
        if (states[currentState] && states[currentState].length > 0) {
            for (let state of states[currentState]) {

                if (state.rule.test(char)) {
                    return state.nextState;
                }

            }
            return states[currentState].error
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


