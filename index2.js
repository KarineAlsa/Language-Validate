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
    // Expresión regular para verificar el formato tr-XXXX-a al ul-9999-z
    const patron = /^(for )$/;
    return patron.test(cadena);
}