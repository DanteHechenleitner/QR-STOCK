document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            mostrarDatosEnTabla(jsonData);
        };

        reader.readAsArrayBuffer(file);
    });
});

function mostrarDatosEnTabla(data) {
    const tabla = document.getElementById('tabla');
    tabla.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('tabla');

    data.forEach(function(row) {
        const tr = document.createElement('tr');

        row.forEach(function(cell) {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    tabla.appendChild(table);

    // Agregar funcionalidad de filtrado y actualización de URL
    const inputFiltro = document.createElement('input');
    inputFiltro.setAttribute('type', 'text');
    inputFiltro.setAttribute('placeholder', 'Filtrar...');
    inputFiltro.addEventListener('keyup', function() {
        const filtro = inputFiltro.value.toLowerCase();
        const filas = tabla.querySelectorAll('tr');

        filas.forEach(function(fila) {
            const celdas = fila.querySelectorAll('td');
            let filaVisible = false;

            celdas.forEach(function(celda) {
                if (celda.textContent.toLowerCase().indexOf(filtro) > -1) {
                    filaVisible = true;
                }
            });

            if (filaVisible) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });

        // Actualizar URL con el filtro aplicado
        window.history.pushState({ filtro: filtro }, 'Filtro: ' + filtro, '?' + filtro);
    });

    tabla.parentNode.insertBefore(inputFiltro, tabla);

    // Capturar el evento popstate para manejar los cambios en la URL
    window.addEventListener('popstate', function(event) {
        const filtro = event.state ? event.state.filtro : '';
        inputFiltro.value = filtro;

        // Aplicar el filtro nuevamente
        const filas = tabla.querySelectorAll('tr');

        filas.forEach(function(fila) {
            const celdas = fila.querySelectorAll('td');
            let filaVisible = false;

            celdas.forEach(function(celda) {
                if (celda.textContent.toLowerCase().indexOf(filtro) > -1) {
                    filaVisible = true;
                }
            });

            if (filaVisible) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    });
}

