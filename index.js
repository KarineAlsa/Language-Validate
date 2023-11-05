
function automataRango(cadena) {
    const  patron = /^([g|G][z|Z][a-z|A-Z]-(0{2}[1-9]|0{1}[1-9][0-9]|[1-9][0-9]{2})-[a-z|A-Z]|[h|H][a-f|A-F][a-z|A-Z]-(0{2}[1-9]|0{1}[1-9][0-9]|[1-9][0-9]{2})-[a-z|A-Z])$/;
    return patron.test(cadena);
    //test es un método de js que toma la cadena y la compara con el patron que definimos
}


let states = {
    "declaration": [
        {
            nextState: "q1",
            rule: /^string$/,
            error: "error-q0",
            finalState: 0
        },
        {
            nextState: "q2",
            rule: /^int$/,
            error: "error-q0",
            finalState: 0
        },
        {
            nextState: "q3",
            rule: /^boolean$/,
            error: "error-q0",
            finalState: 0
        },
        {
            nextState: "q1",
            rule: /^func$/,
            error: "error-q0",
            finalState: 0
        },
        {
            nextState: "q1",
            rule: /^string$/,
            error: "error-q0",
            finalState: 0
        },
        {
            nextState: "q1",
            rule: /^string$/,
            error: "error-q0",
            finalState: 0
        },
    ],
    "nameString": [
        {
            nextState: "q4",
            rule: /^([A-Za-z]([A-Za-z0-9_])*)+$/,
            error: "error-q1",
            finalState: 1
        }
    ],
    "nameInt": [
        {
            nextState: "q5",
            rule: /^(0|[1-9][0-9]*)$/,
            error: "error-q2",
            finalState: 0,
        }
    ],
    "nameBoolean": [
        {
            nextState: "q6",
            rule: /^[a-z]$/,
            error: "error-q3"
        }
    ],
    "valueString": [
        {
            nextState: "q5",
            rule: /^=$/,
            error: "error-q4"
        }
    ],
    "valueInt": [
        {
            nextState: "q6",
            rule: /^=$/,
            error: "error-q5"
        }
    ],
    "valueBoolean": [
        {
            nextState: "q7",
            rule: /^=$/,
            error: "error-q6"
        },
    ],
    "equalString": [
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
    "equalInt": [
        {
            nextState: "q13",
            rule: /^[0-9]$/,
            error: "error-q8"
        }
    ],
    "equalBoolean": [
        {
            nextState: "q11",
            rule: /^[1-9]$/,
            error: "error-q9"
        }
    ],
    "valueString": [
        {
            nextState: "q15",
            rule: /^[0-9]$/,
            error: "error-q10"
        }
    ],
    "valueInt": [
        {
            nextState: "q15",
            rule: /^-$/,
            error: "error-11"
        }
    ],
    "valueBoolean": [
        {
            nextState: "q15",
            rule: /^-$/,
            error: "error-q12"
        }
    ],
    "comma": [
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
    let state = "declaration"
    let final
    
    const cadena = document.getElementById('variable').value;
    const chars = cadena.split(/[\n\s]+/)
    console.log(chars)
    resultado.innerHTML = '';
    for (let i = 0; i < chars.length; i++) {

        const span = document.createElement('span');
        
        let expression = chars[i]
        console.log(state)
        
        state = charValidate(expression, state)
        console.log(i)
        
        stateError= state==undefined ? "error-no".split("-") : state.split("-")
        
        if (state == undefined || stateError[0] == "error" ||final == 0) {
            span.textContent = expression;
            resultado.appendChild(span);
            setTimeout(() => {
                span.style.backgroundColor = 'red';
            }, i * 500);
            displayPop(stateError[0], cadena)
            return
        } else {
            span.textContent = expression;
            resultado.appendChild(span);
            setTimeout(() => {
                span.style.backgroundColor = 'lightgreen';
            }, i * 500);
        }

    }
    
    displayPop("correct", cadena);

}
function finalValidate(char, currentState ) {
    if (char) {
        if (states[currentState] && states[currentState].length > 0) {
            for (let state of states[currentState]) {

                if (state.rule.test(char)) {
                    return state.finalState;
                }

            }
            return states[currentState].error
        }
    }
}

function charValidate(char, currentState, ) {
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

function displayPop(state, cadena) {
    const resultado = document.getElementById('resultado');
    if (state=="correct") {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cadena Valida',
            showConfirmButton: false,
            timer: 1500
        })
        resultado.textContent = `La cadena "${cadena}" es válida para el autómata.`;
        resultado.style.color = 'Green';
    } else {
        resultado.textContent = `La cadena "${cadena}" no es válida para el autómata*`;
        Swal.fire('La cadena no es valida');
        resultado.style.color = 'Red';
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Cadena Invalida',
            showConfirmButton: false,
            timer: 1500
        })
    }
}