
let currentTokenIndex = 0;
let conditional = false;
let elseif = false;
let func = false;
let cicle = false;
let resultado= document.getElementById('resultado');

class SyntaxAnalyzer {
constructor() {
    // Define la gramática del lenguaje
    this.productions = {
        program: ['int_declaration', 'string_declaration', 'boolean_declaration', 'if_statement','func_statement'],
        int_declaration: ['int_declaration', 'string_literal', 'equal', 'number', 'pc'],
        string_declaration: ['string_declaration', 'string_literal', 'equal','string', 'pc'],
        boolean_declaration: ['boolean_declaration', 'string_literal', 'equal', 'true_or_false', 'pc'],
        if_statement: ['if_statement', '(', 'conditional', ')', '{', 'program', '}'],
        func_statement: ['func_statement', 'string','(',')', '{', '}'],
        cicle_statement: ['cicle_statement', '(','int_declaration','string_literal','equal','number','pc','','(','param' ,')', '{', 'program', '}']
    };

    this.productions1 = {
        A: {},
        int_declaration: ['int_declaration', 'string_literal', 'equal', 'number', 'pc'],
        string_declaration: ['string_declaration', 'string_literal', 'equal','string', 'pc'],
        boolean_declaration: ['boolean_declaration', 'string_literal', 'equal', 'true_or_false', 'pc'],
        if_statement: ['if_statement', '(', 'conditional', ')', '{', 'program', '}'],
        func_statement: ['func_statement', 'string','(',')', '{', '}'],
        cicle_statement: ['cicle_statement', '(','int_declaration','string_literal','equal','number','pc','','(','param' ,')', '{', 'program', '}']
    };

    this.dictionary = [
        { type: 'else', regex: /^else/ },
        { type: 'int_declaration', regex: /^int/ },
        { type: 'string_declaration', regex: /^string/ },
        { type: 'boolean_declaration', regex: /^boolean/ },
        { type: 'if_statement', regex: /^if/ },
        { type: 'func_statement', regex: /^func/ },
        { type: 'number', regex: /^(([1-9][0-9]*)|0)/},
        { type: 'string_literal', regex: /^(?!int\b)(?!string\b)(?!boolean\b)(?!true\b)(?!false\b)[a-zA-Z_]([a-zA-Z0-9_]*)/ },
        { type: 'conditional', regex: /^[a-zA-Z_]+([a-zA-Z0-9_]*)\s*((==|<=|>=|!|<|>){1})\s*(([a-zA-Z_]+([a-zA-Z0-9_]*))|([1-9][0-9]*)|0)/ },
        { type: 'string', regex: /^"([\s"a-zA-Z0-9][a-zA-Z0-9_]*)+"/ },
        { type: 'true_or_false', regex: /^(true|false)+/ },
        { type: 'opes', regex: /^((\+){2})|((\-){2})/ },
        { type: '(', regex: /^\(/ },
        { type: ')', regex: /^\)/ },
        { type: '{', regex: /^\{/ },
        { type: '}', regex: /^\}/ },
        { type: '"', regex: /^\"/ },
        { type: 'pc', regex: /^;/ },
        { type: '+', regex: /^(\+){1}/ },
        { type: '-', regex: /^-/ },
        { type: '*', regex: /^\*/ },
        { type: '$', regex: /^\$/ },
        { type: 'equal', regex: /^=/ },
    ];

    this.stack = ['$'];
    this.input = [];
    this.currentProduction = 'program';
}



tokenize(sourceCode) {
    const tokenizedCode = [];
    let match;
    console.log(sourceCode)
    
    while (sourceCode) {
        let foundMatch = false;

        for (const { type, regex } of this.dictionary) {
            match = sourceCode.match(regex);
            
            if (match && match.index === 0) {
                const value = match[0].trim();
                
                this.input.push(type);
                sourceCode = sourceCode.slice(value.length).trim();
                foundMatch = true;
                break;
            }
            
        } 
        
        
        
        
    }
    this.input.push('$');
    
    for (let i = this.input.length-1; i >=0;i--){      
        if (this.productions.hasOwnProperty(this.input[i])){
            for(let j = this.productions[this.input[i]].length-1; j >= 0; j--){
                
                
                this.stack.push(this.productions[this.input[i]][j])
            }
        }  
    }
    
}

analyze() {
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
}

// Ejemplo de uso
const syntaxAnalyzer = new SyntaxAnalyzer();
syntaxAnalyzer.tokenize('int nuevo');

syntaxAnalyzer.analyze();
