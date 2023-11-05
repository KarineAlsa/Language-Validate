function evaluarCadena() {
    const cadena = document.getElementById('variable').value;
    const esValida = automataRangoPersonalizado(cadena);
    const resultado = document.getElementById('resultado');

    if (esValida) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cadena Valida',
            showConfirmButton: false,
            timer: 1500
        })
        resultado.textContent =`La cadena "${cadena}" es válida para el autómata.`;
        resultado.style.color = 'Green';
    } else {
        resultado.textContent = `La cadena "${cadena}" no es válida para el autómata.`;

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

function automataRangoPersonalizado(cadena) {
    //declaración de varibles
            const patron = /^(int\s|string\s|boolean\s|)$/;
            //const patron = /^([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)$/; //nombres 
            //const patron = /^(true|false|[0-9]+|"([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)")$/;
            
            //const patron = /^((int\s|string\s|boolean\s)([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)\s*=\s*(true|false|[0-9]+|"([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)"))$/;

    //declaración de ciclos
          //const patron = /^(for\s*\()$/;
          //const patron = /^(int\s(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)=([0-9]|[a-z|A-Z]));)$/; 
          //const patron = /^(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)(>=|<=|>|<|==)(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)|[0-9]+);)$/; 
          //const patron = /^(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)(\++|--))$/; 
          
          //const patron = /^(for\s*\((int\s(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)=([0-9]|[a-z|A-Z]));)(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)(>=|<=|>|<|==)(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)|[0-9]+);)(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)(\++|--))\)\{(contenido)\})$/;

    //declaracion de funciones
          //const patron = /^(func\s*"(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*))"\(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)?\)\{(contenido)\})$/

    //declaracion de condicionales
          //const patron = /^(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)(>=|<=|>|<|==|!)(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)|[0-9]+))$/; //NON NOV NOR
          //const patron = /^(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)(==|!)(true|false))$/; //NOR
          
          //const patron = /^(if\s*\((([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)(>=|<=|>|<|==|!)(([a-z|A-Z]+(([a-z|A-Z]|[0-9])+)*)|[0-9]+))\)\{(contenido)\}(else\{(contenido)\}))$/;
    return patron.test(cadena);
}