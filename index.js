
function automataRango(cadena) {
    const patron = /^([g|G][z|Z][a-z|A-Z]-(0{2}[1-9]|0{1}[1-9][0-9]|[1-9][0-9]{2})-[a-z|A-Z]|[h|H][a-f|A-F][a-z|A-Z]-(0{2}[1-9]|0{1}[1-9][0-9]|[1-9][0-9]{2})-[a-z|A-Z])$/;
    return patron.test(cadena);
    //test es un método de js que toma la cadena y la compara con el patron que definimos
}


let states = {
    "q0": [
        {
            nextState: "q1",
            rule: /^g$/,
            error: "error-q0"
        },
        {
            nextState: "q2",
            rule: /^h$/,
            error: "error-q0"
        }
    ],
    "q1": [
        {
            nextState: "q3",
            rule: /^z$/,
            error: "error-q1"
        }
    ],
    "q2": [
        {
            nextState: "q4",
            rule: /^[a-f]$/,
            error: "error-q2"
        }
    ],
    "q3": [
        {
            nextState: "q5",
            rule: /^[a-z]$/,
            error: "error-q3"
        }
    ],
    "q4": [
        {
            nextState: "q5",
            rule: /^[a-z]$/,
            error: "error-q4"
        }
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
    let state = "q0"
    
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
            displayPop(stateError[0], cadena)
            return
        } else {
            span.textContent = letra;
            cadenaIluminada.appendChild(span);
            setTimeout(() => {
                span.style.backgroundColor = 'lightgreen';
            }, i * 500);
        }

    }
    displayPop("correct", cadena);
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