

const tokens = [
    { type: 'tipo', regex: /^(int|boolean|string|if|func|for|else)/ },
    { type: 'boolean', regex: /^(true|false)+/ },
    { type: 'IDENTIFICADOR', regex: /^[a-zA-Z_]([a-zA-Z0-9_]*)/ },
    { type: '=', regex: /^=/ },
    { type: 'int', regex: /^(([1-9][0-9]*)|0)/},
    { type: 'string', regex: /^"([\s"a-zA-Z0-9][a-zA-Z0-9_]*)*"/ },
    { type: 'boolean', regex: /^(true|false)+/ },
    { type: 'func', regex: /^function/ },
    { type: '(', regex: /^\(/ },
    { type: ')', regex: /^\)/ },
    { type: '{', regex: /^\{/ },
    { type: '}', regex: /^\}/ },
    { type: 'if', regex: /^[a-zA-Z_]([a-zA-Z0-9_]*)/ },
    { type: 'function', regex: /^function/ },
    { type: 'else', regex: /^else/ },
    { type: 'for', regex: /^for/ },
    { type: ',', regex: /^,/ },
    { type: ';', regex: /^;/ },
    { type: '>', regex: /^>/ },
    { type: '<', regex: /^</ },
    { type: '+', regex: /^\+/ },
    { type: '-', regex: /^-/ },
    { type: '*', regex: /^\*/ },
    { type: '/', regex: /^\// },
    { type: '<=', regex: /^<=/ },
    { type: '>=', regex: /^>=/ },
];


function tokenize(sourceCode) {
    const tokenizedCode = [];
    let match;
    
    while (sourceCode) {
        let foundMatch = false;

        for (const { type, regex } of tokens) {
            match = sourceCode.match(regex);
            
            if (match && match.index === 0) {
                
                const value = match[0];
                tokenizedCode.push({ type, value });
                sourceCode = sourceCode.slice(value.length).trim();
                
                foundMatch = true;
                break;
            }
        }

        if (!foundMatch) {
            throw new Error('Error de tokenización: No se pudo analizar el código fuente en ');
        }
    }
    
    return tokenizedCode;
}

function parseProgram(tokens1) {
    let currentTokenIndex = 0;
    function consume(type) {
        
        const token = tokens1[currentTokenIndex];
        
        if (token && token.type === type) {
            const value = token.value;
            currentTokenIndex++;
            return value;
        } else {
            if(type==="if"||type==="string"||type==="int"||type==="func"||type==="boolean") {
                throw new Error(`Error de sintaxis: Se esperaba un token de tipo expresión ${type} después de ${tokens1[currentTokenIndex-1].value}`);
                process.exit(1);
            }
            throw new Error(`Error de sintaxis: Se esperaba un token de tipo ${type} después de ${tokens1[currentTokenIndex-1].value}`);
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
        parseProgram();
        consume('}');
    }

    function parseParametros() {
        while (tokens[currentTokenIndex].type === 'tipo') {
            consume('tipo');
            consume('IDENTIFICADOR');
            if (tokens[currentTokenIndex].type !== ',') {
                break;
            }
            consume(',');
        }
    }

    function parseConditional() {
        const type = consume('tipo');
        consume('(');
        parseExpresion(type);
        consume(')');
        consume('{');
        parseProgram();
        consume('}');
        if (tokens[currentTokenIndex].type === 'else') {
            consume('else');
            consume('{');
            parseProgram();
            consume('}');
        }
    }

    function parseCicloFor() {
        consume('for');
        consume('(');
        parseInicializacion();
        consume(';');
        parseCondicion();
        consume(';');
        parseActualizacion();
        consume(')');
        consume('{');
        parseProgram();
        consume('}');
    }


    while (currentTokenIndex < tokens1.length) {
        if (tokens1[currentTokenIndex].value === 'int' || tokens1[currentTokenIndex].value === 'string' || tokens1[currentTokenIndex].value === 'boolean') {
            parseDeclarationVariable();
        } else if (tokens1[currentTokenIndex].value === 'func') {
            parseFunction();
        } else if (tokens1[currentTokenIndex].value === 'if') {
            console.log(tokens1[currentTokenIndex].value);
            parseConditional();
        } else if (tokens1[currentTokenIndex].value === 'for') {
            parseCicloFor();
        } else {
            throw new Error('Error de sintaxis: Estructura no reconocida, pruebe con string,int,boolean,func,if,for...');
        }
    }
}

function validateString() {
    const cadena = document.getElementById('variable').value;
    const tokens1 = tokenize(cadena);
    console.log(tokens1);
    parseProgram(tokens1);
    console.log("El código es sintácticamente válido.");
    
}

