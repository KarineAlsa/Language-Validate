const tokens = [
    { type: 'else', regex: /^else/ },
    { type: 'tipo', regex: /^(int|boolean|string|func)\s+|for|if/ },
    { type: 'for', regex: /^(int)\s+/ },
    { type: 'if', regex: /^[a-zA-Z_]+([a-zA-Z0-9_]*)\s*((==|<=|>=|!|<|>){1})\s*(([a-zA-Z_]+([a-zA-Z0-9_]*))|([1-9][0-9]*)|0)/ },
    { type: 'IDENTIFICADOR', regex: /^(?!int\b)(?!string\b)(?!boolean\b)(?!true\b)(?!false\b)[a-zA-Z_]([a-zA-Z0-9_]*)/ },
    { type: 'boolean', regex: /^(true|false)+/ },
    { type: 'int', regex: /^(([1-9][0-9]*)|0)/},
    { type: 'string', regex: /^"([\s"a-zA-Z0-9][a-zA-Z0-9_]*)*"/ },
    { type: 'boolean', regex: /^(true|false)+/ },
    { type: 'func', regex: /^function/ },
    { type: 'opes', regex: /^((\+){2})|((\-){2})/ },
    { type: '(', regex: /^\(/ },
    { type: ')', regex: /^\)/ },
    { type: '{', regex: /^\{/ },
    { type: '}', regex: /^\}/ },
    { type: ',', regex: /^,/ },
    { type: ';', regex: /^;/ },
    { type: '+', regex: /^(\+){1}/ },
    { type: '-', regex: /^-/ },
    { type: '*', regex: /^\*/ },
    { type: '/', regex: /^\// },
    { type: '=', regex: /^=/ },
];


function tokenize(sourceCode) {
    const tokenizedCode = [];
    let match;
    
    while (sourceCode) {
        let foundMatch = false;

        for (const { type, regex } of tokens) {
            match = sourceCode.match(regex);
            
            
            if (match && match.index === 0) {
                const value = match[0].trim();
                tokenizedCode.push({ type, value });
                sourceCode = sourceCode.slice(value.length).trim();
                foundMatch = true;
                break;
            }
            
        }
        
        if (!foundMatch) {
            resultado.textContent =`no encontrado: ${sourceCode} `;
            resultado.style.color = 'Red';
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Error de lenguaje: No existe dentro del lenguaje: ${sourceCode}`,
                showConfirmButton: false,
                timer: 3000
            })
            throw new Error('Error de lenguaje: No existe dentro del lenguaje');
        }
    }
    
    
    return tokenizedCode;
}

let currentTokenIndex = 0;
let conditional = false;
let elseif = false;
let func = false;
let cicle = false;
let resultado;
function parseProgram(tokens1) {
    
    function consume(type) {
        const token = tokens1[currentTokenIndex];
        

        if (token && token.type == type) {
            
            const value = token.value;
            currentTokenIndex++;
            return value;
        } else if(token && type== 'for' && token.value=="int") {
            const value = token.value;
            currentTokenIndex++;
            return value;
        }else {
            if(type==="if"||type==="string"||type==="int"||type==="func"||type==="boolean"||type==="else"||type==="for") {
                let currentTokenIndexRep = currentTokenIndex;
                currentTokenIndex = 0;
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `Error de sintaxis: Se esperaba un token de tipo expresión ${type} después de ${tokens1[currentTokenIndexRep-1].value}`,
                    showConfirmButton: false,
                    timer: 3000
                })
                resultado.textContent =`expresión ${type} después de ${tokens1[currentTokenIndexRep-1].value}`;
                resultado.style.color = 'Red';
                
                throw new Error(`Error de sintaxis: Se esperaba un token de tipo expresión ${type} después de ${tokens1[currentTokenIndexRep-1].value}`);
            }else{
                let currentTokenIndexRep = currentTokenIndex;
                currentTokenIndex = 0;
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `Error de sintaxis: Se esperaba un token de tipo ${type} después de ${tokens1[currentTokenIndexRep-1].value}`,
                    showConfirmButton: false,
                    timer: 3000
                })
                resultado.textContent =`tipo ${type} después de ${tokens1[currentTokenIndexRep-1].value}`;
                resultado.style.color = 'Red';
                
                throw new Error(`Error de sintaxis: Se esperaba un token de tipo ${type} después de ${tokens1[currentTokenIndexRep-1].value}`);
            }
        }
    }

    function parseDeclarationVariable() {
        
        const type = consume('tipo');
        consume('IDENTIFICADOR');
        
        consume('=');
        parseExpresion(type);
        consume(';');
    }

    function parseExpresion(type){
        consume(type);
    }

    function parseFunction() {
        const type = consume('tipo');
        consume('string');
        consume('(');
        parseParametros();
        consume(')');
        consume('{');
        parseProgram(tokens1);
        consume('}');
    }

    function parseParametros() {
        
        while (tokens1[currentTokenIndex] &&tokens1[currentTokenIndex].type === 'IDENTIFICADOR') {   
            consume('IDENTIFICADOR');
            if (tokens1[currentTokenIndex].type !== ',') {
                
                break;
            }
            consume(',');
        }
        if (tokens1[currentTokenIndex] &&tokens1[currentTokenIndex].type === ',') {
            throw new Error("Error: Coma no esperada al final de la lista de parámetros.");
        }
    }

    function parseConditional() {
        conditional = true;
        const type = consume('tipo');
        consume('(');
        consume('if');
        //consume(type)
        consume(')');
        consume('{');
        parseProgram(tokens1);
        consume('}');
       
        if (tokens1[currentTokenIndex]!=undefined && tokens1[currentTokenIndex].value =='else') {
            elseif = true;
            
            consume('else');
            consume('{');
            parseProgram(tokens1);
            consume('}');
        }
        conditional = false;
        elseif = false;
    }

    function parseCicloFor() {
        const type = consume('tipo');
        

            consume('(');
            parseInicial();
            //consume('inicial')
            consume(';');
            parseCondicion();
            consume(';');
            parseActualizacion();
            consume(')');
            consume('{');
            parseProgram(tokens1);
            consume('}');
        
    }
    function parseInicial() {
        consume('for')
        consume('IDENTIFICADOR')
        consume('=')
        
        if (tokens1[currentTokenIndex].type === 'IDENTIFICADOR'){
            consume('IDENTIFICADOR')

        }else if (tokens1[currentTokenIndex].type === 'int'){
            consume('int')
        }
    }

    function parseCondicion() {
        consume('if')
        
    }
    function parseActualizacion() {
        consume('IDENTIFICADOR')
        consume('opes')

        
    }
    



    while (currentTokenIndex < tokens1.length) {
        if (tokens1[currentTokenIndex].value === 'int' || tokens1[currentTokenIndex].value === 'string' || tokens1[currentTokenIndex].value === 'boolean') {
            parseDeclarationVariable();
        } else if (tokens1[currentTokenIndex].value === 'func') {
            parseFunction();
        } else if (tokens1[currentTokenIndex].value === 'if') {
           
            parseConditional();
        } else if (tokens1[currentTokenIndex].value === 'for') {
            parseCicloFor();
        } else if (tokens1[currentTokenIndex].value === '}'){
            break;
        } else if (tokens1[tokens1.length-1].value === 'else' && conditional ==true){
            break;
        }
        else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Error de sintaxis: Estructura ${tokens1[currentTokenIndex].value} no reconocida, pruebe con string,int,boolean,func,if,for...`,
                showConfirmButton: false,
                timer: 3000
            })
            throw new Error('Error de sintaxis: Estructura no reconocida, pruebe con string, int, boolean, func, if, for...');
        }
    }
}

function validateString() {
    resultado= document.getElementById('resultado');
    resultado.textContent ="";
    resultado.style.color = '';
    currentTokenIndex = 0;
    const cadena = document.getElementById('variable').value;
    const tokens1 = tokenize(cadena);
   
    parseProgram(tokens1);
    
    resultado.textContent =`La cadena "${cadena}" es válida para el autómata.`;
    resultado.style.color = 'Green';
   
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: `La cadena "${cadena}" es válida para el autómata.`,
        showConfirmButton: false,
        timer: 3000
    })
    
}



