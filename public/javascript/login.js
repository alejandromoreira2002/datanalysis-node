$(document).ready( e => {
    $('#submit-button').on('click', _ => {
        
        let username = $('#username-input').val();
        let password = $('#password-input').val();
        let access = $('#access-input').val();

        let htmlAlert = "<div class='alert-container' id='alert-container'><div class='alert alert-danger' role='alert' id='alert-txt'>A simple danger alert—check it out!</div></div>";
        let alertElem = document.getElementById('alert-container');
        if(username.trim() == "" || password.trim() == "" || access.trim() == ""){
            let errorAlert = htmlAlert.replace("A simple danger alert—check it out!", "Por favor rellenar campos.");
            if(alertElem != undefined){
                document.getElementById('container-page').removeChild(alertElem);
            }
            $('#container-page').append($(errorAlert));
        }else{
            $.ajax({
                data: {'username': username, 'password': password, 'access': access},
                url: '/login',
                type: 'post',
                dataType: 'json',
                success: (response, textStatus, xhr) => {
                    let successClass = htmlAlert.replace("alert-danger", "alert-success");
                    let successText = successClass.replace("A simple danger alert—check it out!", "Acceso exitoso. Redirigiendo a la pagina principal...");
                    if(alertElem != undefined){
                        document.getElementById('container-page').removeChild(alertElem);
                    }
                    $('#container-page').append($(successText));
                    setTimeout(() => {
                        location.href ='/users';
                    }, "1000");
                    /*
                    console.log(xhr.status)
                    if(response['text']=="0"){
                        console.log("Datos no coinciden")
                        let errorAlert = htmlAlert.replace("A simple danger alert—check it out!", "El usuario o contraseña no coinciden.");
                        
                        if(alertElem != undefined){
                            document.getElementById('container-page').removeChild(alertElem);
                        }
                        $('#container-page').append($(errorAlert));
                        
                    }else{
                        
                    }*/
                },
                error: (err) => {
                    //console.log("Datos no coinciden")
                    console.log(err.responseJSON['text'])
                    let errorAlert = htmlAlert.replace("A simple danger alert—check it out!", "El usuario o contraseña no coinciden.");
                    
                    if(alertElem != undefined){
                        document.getElementById('container-page').removeChild(alertElem);
                    }
                    $('#container-page').append($(errorAlert));
                }

            });

        }
    })
});