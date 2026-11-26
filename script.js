const displayAnterior = document.getElementById('valor-anterior');
const displayActual = document.getElementById('valor-actual');
const botonesNumero = document.querySelectorAll('.btn-numero');
const botonesOperador = document.querySelectorAll('.btn-operador');
const botonIgual = document.getElementById('btn-igual');
const botonLimpiar = document.getElementById('btn-limpiar');
const botonBorrar = document.getElementById('btn-borrar');

let numeroActual = '0';
let numeroAnterior = '';
let operadorActual = null;
let reiniciarPantalla = false;

function actualizarPantalla() {
    displayActual.textContent = numeroActual;
    if (operadorActual !== null) {
        displayAnterior.textContent = `${numeroAnterior} ${operadorActual}`;
    } else {
        displayAnterior.textContent = '';
    }
}

function agregarNumero(num) {
    if (numeroActual === 'Error') {
        numeroActual = '0';
    }
    if (reiniciarPantalla) {
        numeroActual = '';
        reiniciarPantalla = false;
    }
    if (num === '.' && numeroActual.includes('.')) return;
    if (num === '.' && numeroActual === '') {
        numeroActual = '0.';
        actualizarPantalla();
        return;
    }
    if (numeroActual === '0' && num !== '.') {
        numeroActual = num;
    } else {
        numeroActual += num;
    }
    actualizarPantalla();
}

function seleccionarOperador(operador) {
    if (numeroActual === 'Error') return;

    // Si el usuario cambia de operador antes de escribir el segundo número
    if (operadorActual !== null && reiniciarPantalla) {
        operadorActual = operador;
        actualizarPantalla();
        return;
    }

    if (operadorActual !== null) {
        calcular();
    }

    numeroAnterior = numeroActual;
    operadorActual = operador;
    reiniciarPantalla = true;
    actualizarPantalla();
}

function calcular() {
    if (operadorActual === null || reiniciarPantalla) return;

    const a = parseFloat(numeroAnterior);
    const b = parseFloat(numeroActual);
    let resultado = 0;

    switch (operadorActual) {
        case '+':
            resultado = a + b;
            break;
        case '-':
            resultado = a - b;
            break;
        case '×':
            resultado = a * b;
            break;
        case '÷':
            if (b === 0) {
                numeroActual = 'Error';
                numeroAnterior = '';
                operadorActual = null;
                reiniciarPantalla = true;
                actualizarPantalla();
                return;
            }
            resultado = a / b;
            break;
    }

    // Evita decimales infinitos tipo 0.30000000000000004
    numeroActual = String(Math.round(resultado * 1000000000) / 1000000000);
    operadorActual = null;
    numeroAnterior = '';
    reiniciarPantalla = true;
    actualizarPantalla();
}

function limpiarTodo() {
    numeroActual = '0';
    numeroAnterior = '';
    operadorActual = null;
    reiniciarPantalla = false;
    actualizarPantalla();
}

function borrarDigito() {
    if (reiniciarPantalla || numeroActual === 'Error') {
        limpiarTodo();
        return;
    }
    if (numeroActual.length === 1) {
        numeroActual = '0';
    } else {
        numeroActual = numeroActual.slice(0, -1);
    }
    actualizarPantalla();
}

// Eventos de clic
botonesNumero.forEach(boton => {
    boton.addEventListener('click', () => agregarNumero(boton.dataset.numero));
});

botonesOperador.forEach(boton => {
    boton.addEventListener('click', () => seleccionarOperador(boton.dataset.operador));
});

botonIgual.addEventListener('click', calcular);
botonLimpiar.addEventListener('click', limpiarTodo);
botonBorrar.addEventListener('click', borrarDigito);

// Soporte para teclado físico
window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        agregarNumero(e.key);
    } else if (e.key === '+' || e.key === '-') {
        seleccionarOperador(e.key);
    } else if (e.key === '*') {
        seleccionarOperador('×');
    } else if (e.key === '/') {
        e.preventDefault();
        seleccionarOperador('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calcular();
    } else if (e.key === 'Backspace') {
        borrarDigito();
    } else if (e.key === 'Escape') {
        limpiarTodo();
    }
});