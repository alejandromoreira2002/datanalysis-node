let counter = 4;

$(document).ready(() => {
    cargarUsuarios();

    $('#add_row').on("click", () => {
        let addRowContainer = document.getElementById('addRow-container');
        if (addRowContainer.hasAttribute('style')) {
            addRowContainer.removeAttribute('style');
        } else {
            addRowContainer.setAttribute('style', 'display: none;');
        }
        //addRowContainer.classList.add('addRow-container-open');
        /*
        addRowContainer.addEventLister('animationend', (e) => {
          document.getElementById('addRow-content').classList.add('addRow-content-open');
        })*/
        /*
        let tableRow = "<tr><th scope='row'>"+counter+"</th><td><input type='text'></td><td><input type='text'></td><td><input type='text'></td><td><button onClick='anadir(this)'>Add</button></td></tr>";
        $('#table').find('tbody').append(tableRow);
        counter = counter + 1;*/
    });
});

function cancelarOp() {
    let addRowContainer = document.getElementById('addRow-container');
    addRowContainer.setAttribute('style', 'display: none;');
    borrarInputs();
}

function guardarUsuario() {
    const formatearAlert = (mensaje, tipo) => {
        let alertHTML = `<div class="alert alert-${tipo} alert-dismissible" id="alerta-content" role="alert">
                                <div>${mensaje}</div>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="cerrarAlerta()"></button>
                              </div>`;
        return alertHTML;
    };

    /*
    let username = $('#username-input').val().trim();
    let email = $('#email-input').val().trim();
    let password = $('#password-input').val().trim();
    let rol = $('#rol-select').val().trim();
    */

    let username = $('#username-input').val().toString().trim();
    let email = $('#email-input').val().toString().trim();
    let password = $('#password-input').val().toString().trim();
    let rol = $('#rol-select').val();

    //let alertaRegistro = document.getElementById('alerta-content');

    if (username == "" || email == "" || password == "" || rol == "default") {
        cerrarAlerta();
        $('#alerta-registro').append($(formatearAlert("Por favor, rellene los campos.", "danger")));
    } else {
        $.ajax({
            data: { 'username': username, 'email': email, 'password': password, 'rol': rol },
            url: '/users/',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response == "1") {
                    cerrarAlerta();
                    $('#alerta-registro').append($(formatearAlert("El usuario ha sido registrado con éxito.", "success")));
                    setTimeout(() => {
                        cancelarOp();
                    }, "1000");
                    setLoadingData();
                    cargarUsuarios();
                } else {
                    cerrarAlerta();
                    $('#alerta-registro').append($(formatearAlert(response, "danger")));
                }
            },
            error: function () {
                cerrarAlerta();
                $('#alerta-registro').append($(formatearAlert("Error al comunicarse con el servidor", "danger")));
            }
        });
    }
}

function setLoadingData() {
    let tableForm = $('#table-form');
    let loadContent = `<div class="load-content" id="load-content">
                                <div class="spinner-border" role="status">
                                  <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>`;

    tableForm.append($(loadContent));
}

function cerrarAlerta() {
    let alertaContent = document.getElementById('alerta-content');
    if (alertaContent != undefined) {
        document.getElementById('alerta-registro').removeChild(alertaContent);
    }
}

function borrarInputs() {
    $('#username-input').val('');
    $('#email-input').val('');
    $('#password-input').val('');
    $('#rol-select').val('default');
    cerrarAlerta();
}

function cargarUsuarios() {
    $.ajax({
        url: '/users/dataUsers',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response != 0) {
                let tableForm = document.getElementById('table-form');
                let loadDiv = document.getElementById('load-content');

                formatearTabla(response);

                tableForm.removeChild(loadDiv);

            }
        },
        error: function () {
            $('#resultado').html("<p style='color: gray;'>Hubo un problema</p>");
        }
    });
}

function formatearTabla(data) {
    let tabla = $('#tableBody');
    tabla.empty();
    console.log(typeof data[0]['fecha_creado']);

    for (let i = 0; i < data.length; i++) {
        let fecha = new Date(data[i]['fecha_creado']);
        let createdAt = fecha.getDate() + "-" + fecha.getMonth() + "-" + fecha.getFullYear();
        let fila = `<tr>
                          <th scope="row">${data[i]['_id']}</th>
                          <td>${data[i]['usuario']}</td>
                          <td>${data[i]['email']}</td>
                          <td>${data[i]['rol']}</td>
                          <td>${createdAt}</td>
                        </tr>`;
        tabla.append($(fila));
    }
}

function anadir(elem) {
    //document.getElementById('hola').parent
    let fila = elem.parentElement.parentElement;
    let hijos = fila.childNodes;


    let id = hijos[0].innerText.trim() == "" ? null : hijos[0].innerText.trim();
    let username = hijos[1].firstChild.value.trim() == "" ? null : hijos[1].firstChild.value.trim();
    let email = hijos[2].firstChild.value.trim() == "" ? null : hijos[2].firstChild.value.trim();
    let password = hijos[3].firstChild.value.trim() == "" ? null : hijos[3].firstChild.value.trim();

    const params = {
        "id": hijos[0].innerText,
        "username": hijos[1].firstChild.value,
        "email": hijos[2].firstChild.value,
        "password": hijos[3].firstChild.value
    }

    $.ajax({
        data: params,
        url: 'prueba.php',
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response == 1) {
                fila.parentElement.removeChild(fila);

                let newRow = "<tr><th scope='row'>" + params['id'] + "</th><td>" + params['username'] + "</td><td>" + params['email'] + "</td><td>" + params['password'] + "</td></tr>";
                $('#table').find('tbody').append(newRow);
                $('#resultado').html("<p style='color: green;'>Se agregaron correctamente los datos</p>");
            } else {
                $('#resultado').html("<p style='color: red;'>No se agregaron los datos</p>");
            }
        },
        error: function () {
            $('#resultado').html("<p style='color: gray;'>Hubo un problema</p>");
        }
    });
}