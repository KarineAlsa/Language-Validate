class Automaton {

//esto es de adolfo 

    current_rule_group_index = -1
    current_structure_key = null
    current_state = null
    current_rule = [] // Stack con la regla actual
    tokens = [[]] // Código pasado a palabras: fn algo => ["fn", "algo"].
    max_recursive_functions_call = 500
    still_validating = false

    /**
     * 
     * @param {number} delay_between_iteration Tiempo de retardo entre iteración al stack de input
     * @param {Array<string>} code_as_array Código del editor convertido en Array, cada índice es una líne de código.
     * @param {HTMLUListElement} visual_input_stack Elemento HTML donde se apílan los carácteres del código para visualizarlo en el Documento.
     * @param {HTMLUListElement} visual_output_stack Elemento HTML donde se apílan las reglas evaluadas para visualizarlas en el Documento.
     */
    constructor(
        delay_between_iteration,
        code_as_array,
        visual_input_stack,
        visual_output_stack
    ) {
        this.delay_between_iteration = delay_between_iteration || 100;
        this.code_as_array = code_as_array;
        this.visual_input_stack = visual_input_stack;
        this.visual_output_stack = visual_output_stack;
    }

    /**
     * Prepara el código, elimina doble espacios del código y tokeniza los carácteres.
     */
    load() {
        this.visual_input_stack.innerHTML = ''
        this.visual_output_stack.innerHTML = ''
        this.tokens = []
        this.current_structure_key = null

        for (let line_number = 0; line_number < this.code_as_array.length; line_number++) {
            this.tokens.push(
                this.code_as_array[line_number]
                    .replace(/\s+/g, ' ') // Reemplaza todas los dobles espacios en blanco por un único espacio en blanco.
                    .replace(/(:|{|}|,|\(|\)|;|>|<|==|!=|\+\+|--|")/g, ' $1 ') // Los símbolos como :, =, ", etc. les añade espacio al final y al frente,Ejemplo -> num: algo: "alga" => num : algo " alga "
                    .replace(/\s+/g, ' ') // Vuelve a eliminar los dobles espacios por si se generaron nuevos durante el paso anterior
                    .trim() // Elimina espacios al principio y al final
                    .split(" ") // Separa por palabras
                    .filter((token) => token !== "") // Elimina todos los elementos que solo contengan espacios vacíos. Solo útil para cuando se manda con el editor vacío
            )
        }

        for (let line_number = 0; line_number < this.tokens.length; line_number++) {
            for (let token_number = 0; token_number < this.tokens[line_number].length; token_number++) {

                const current_token = document.createElement("li")
                current_token.textContent = this.tokens[line_number][token_number]

                stack.appendChild(current_token)
            }
        }
    }

    async start() {
        while (this.tokens.length > 0) {
            while (this.tokens[0].length > 0) {
                // this.__update_first_element_stack_input()
                this.__analize_token(this.tokens[0].shift())
                // this.max_recursive_functions_call = 10;
                await this.__wait()
                // this.__remove_first_element_stack_input()
            }
            this.tokens.shift()
        }
    }

    /**
     * Hace pausas definida en propiedad delay_between_iteration
     */
    __wait() {
        return new Promise(resolve => setTimeout(resolve, this.delay_between_iteration))
    }

    __analize_token(token) {
        if (!this.current_structure_key) {
            this.__recognize_structure(token)
        }
        this.__navigate_into_grammar(token)
    }

    __navigate_into_grammar(token) {
        console.log(JSON.stringify(this.current_rule))

        if (this.current_rule.length < 1) {
            throw new Error("Este es un error porque aun no sé que hacer en esta parte \n Array de reglas vacías")
        }

        const current_group_of_rule = this.current_rule[this.current_rule.length - 1][0]
        const first_rule_under_review = this.grammar[this.current_structure_key][current_group_of_rule[0]]

        if (!first_rule_under_review.reg) {
            this.current_rule.push(first_rule_under_review.next)
            this.tokens[0].unshift(token)
            return
            throw new Error("Este es un error porque aun no sé que hacer en esta parte \n No tiene expresion regular, no es terminal pues")
        }

        if (!first_rule_under_review.treat_as_word) {
            console.log(`No Entró: ${token} - ${first_rule_under_review.reg} | ${current_group_of_rule[0]}`)
            if (this.__char_by_char_analizer(token.split(""))) {
                this.current_rule[this.current_rule.length - 1][0].shift()
            }
            return
        }

        if (first_rule_under_review.reg.test(token)) {
            console.log(`Entró: ${token} - ${first_rule_under_review.reg} | ${current_group_of_rule[0]}`)
            current_group_of_rule.shift()
            if (first_rule_under_review.last_transition) {
                this.current_rule_group_index = -1
                this.current_structure_key = null
                this.current_state = null
                this.current_rule = []
                return
            }
            console.log
        }

    }

    __char_by_char_analizer(token_as_array) {
        let can_i_remove = false
        let is_validate = false
        this.max_recursive_functions_call--

        const current_char = token_as_array[0]
        token_as_array.shift()

        console.log(JSON.stringify(this.current_rule))
        const first_key_to_check = this.current_rule[this.current_rule.length - 1]
        for (let alternatives = 0; alternatives < this.current_rule[this.current_rule.length - 1].length; alternatives++) {
            const key_to_search_into_grammar = first_key_to_check[alternatives][0];

            if (key_to_search_into_grammar === null) {
                if (token_as_array.length === 0 && current_char === undefined) {
                    this.current_rule.pop()
                    return true
                }
                throw new Error(`Unexpected char ${current_char}`)
            }

            const rule = this.grammar[this.current_structure_key][key_to_search_into_grammar]

            if (!rule.reg) {
                // console.log("Restoring last char since no reg to evaluated: " + current_char)
                this.current_rule.push(
                    rule.next
                )
                token_as_array.unshift(current_char)
                is_validate = true
                break;
            }


            if (rule.reg.test(current_char)) {
                let copy = [...first_key_to_check[alternatives]]
                copy.shift()
                let new_rule = copy

                this.current_rule[this.current_rule.length - 1] = [new_rule]
                can_i_remove = true
                is_validate = true
                // console.log(this.current_rule)
            }
        }

        if (!is_validate) {
            console.error(first_key_to_check)
            throw new Error("Illega character: " + current_char)
        }


        if (this.max_recursive_functions_call <= 0) {
            console.warn("Este es un error totalmente intencionado. Este lexer usa recursividad para evaluar el nombre de carácteres, cuando se excede el número máximo de llamadas permitido, arroja el siguiente error.")
            throw new Error("Doup! We almost died. \nThis error appears when a variable name is too large and exceeds the total number of allowed references. \nYou can set the number called in the 'max_recursive_functions_call' property.")
        }

        if (this.__char_by_char_analizer(token_as_array)) {
            if (can_i_remove) {
                this.current_rule.pop()
            }
            console.log(JSON.stringify(this.current_rule))
            return true
        }
    }

    /**
     * Valida el primer token entre las primeras transiciones de la gramática hasta encontrar
     * el primero que satisfaga con la regla.
     * @param {string} token 
     */
    __recognize_structure(token) {
        let temporal_register = []

        for (let structure_index = 0; structure_index < Object.keys(this.grammar).length; structure_index++) {

            const structure_under_review = this.grammar[Object.keys(this.grammar)[structure_index]]
            const initial_state = Object.keys(structure_under_review)[0]

            // Valida si la transición inicial tiene referencias o es una transición terminal, si no, hubo un error y salta esta estructura
            if (!structure_under_review[initial_state].reg && structure_under_review[initial_state].next.length === 0) {
                console.warn(`La estructura "${Object.keys(this.grammar)[structure_index]}" no contiene referencias a otros nodos o una expresión regular para evaluar.\n\nOmitiendo.`)
                continue
            }

            if (structure_under_review[initial_state].next) {
                const alternatives = structure_under_review[initial_state].next

                for (let alternative_index = 0; alternative_index < alternatives.length; alternative_index++) {
                    temporal_register = alternatives[alternative_index]
                    if (this.__validate_first_transition(temporal_register, structure_under_review, token)) {
                        this.current_structure_key = Object.keys(this.grammar)[structure_index]
                        this.current_rule.push([temporal_register])
                        this.current_rule_group_index = 0
                        this.current_state = initial_state

                        this.__add_output_stack('info', 'Nueva estructura localizada: ' + this.current_structure_key)
                        this.__add_output_stack('reg', `Inicial: ${this.current_state} => ${this.current_rule.map((item) => { return item })}`)
                    }
                }

            }

        }

        if (!this.current_structure_key) {
            console.log(this)
            throw new Error("No se pudo encontrar una estrucutura válida para este token: " + token)
        }
    }

    /**
     * Valida la primera referencia del registro dado.
     * @param {Array<string>} registers 
     */
    __validate_first_transition(registers, structure, token) {
        if (!structure[registers[0]].reg) {
            console.warn("Esta estructura no contiene una expresión que evaluar.\nOmitiendo por ahora.\nTransición: " + [registers[0]])
            return false
        }
        if (structure[registers[0]].reg.test(token)) {
            return structure[registers[0]]
        }
    }

    __add_output_stack(className, message) {
        const element_to_add = document.createElement('li')
        element_to_add.classList.add(className)
        element_to_add.textContent = message
        this.visual_output_stack.appendChild(element_to_add)
    }

    __update_first_element_stack_input() {
        this.visual_input_stack.firstChild.classList.add('active')
    }

    __remove_first_element_stack_input() {
        this.visual_input_stack.firstChild.remove()
    }
}