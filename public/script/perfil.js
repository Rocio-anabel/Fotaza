document.addEventListener('DOMContentLoaded', () => {

    const btnSeguir =
        document.getElementById('btnSeguir');

    if(!btnSeguir){
        return;
    }

    btnSeguir.addEventListener(
        'click',
        async () => {

            const idUsuario =
                btnSeguir.dataset.idUsuario;

            try{

                const response =
                    await fetch('/seguir', {

                        method: 'POST',

                        headers: {
                            'Content-Type':
                            'application/json'
                        },

                        body: JSON.stringify({
                            idUsuario
                        })

                    });

                if(response.status === 401){

                    window.location.href =
                        '/auth/login';

                    return;

                }

                if(!response.ok){

                    throw new Error(
                        await response.text()
                    );

                }
                const datos = await response.json();
                
                btnSeguir.dataset.siguiendo =
                    datos.siguiendo;

                btnSeguir.textContent =
                    datos.siguiendo
                        ? 'Siguiendo'
                        : 'Seguir';

                btnSeguir.classList.toggle(
                    'btn-dark',
                    !datos.siguiendo
                );

                btnSeguir.classList.toggle(
                    'btn-outline-dark',
                    datos.siguiendo
                );


            }catch(error){

                console.error(error);

            }

        }
    );

});