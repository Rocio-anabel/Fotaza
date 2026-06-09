

document.addEventListener('DOMContentLoaded', () => {

    const imagenes = window.imagenesPublicacion;

    const card = document.querySelector('.card');

    const idPublicacion = card.dataset.publicacionId;

    const detalle = document.getElementById(`detalleImagen-${idPublicacion}`);

    function estrellas(promedio){

        const completas = Math.floor(promedio);

        let html = '';

        for(let i = 0; i < completas; i++){

            html +=
                '<i class="bi bi-star-fill text-warning"></i>';

        }

        for(let i = completas; i < 5; i++){

            html +=
                '<i class="bi bi-star text-warning"></i>';

        }

        return html;
    }

    function renderizar(index){

        const imagen = imagenes[index];
        

        let valoracionHTML = ` <form id="formVotoImagen" >

                                    <input
                                        type="hidden"
                                        name="idImagen"
                                        value="${imagen.idImagen}"
                                    >

                                    <div
                                        class="rating d-flex gap-1 fs-3 mb-2"
                                        data-imagen="${imagen.idImagen}"
                                    >

                                        <i class="bi bi-star estrella" data-valor="1"></i>
                                        <i class="bi bi-star estrella" data-valor="2"></i>
                                        <i class="bi bi-star estrella" data-valor="3"></i>
                                        <i class="bi bi-star estrella" data-valor="4"></i>
                                        <i class="bi bi-star estrella" data-valor="5"></i>

                                    </div>

                                    <input
                                        type="hidden"
                                        name="valor"
                                        id="valorSeleccionado"
                                    >
                                </form>`;

        
        detalle.innerHTML = `

            <div class="mb-4">

                <h5>Tu valoración</h5>
                ${valoracionHTML}

                <p class="text-muted">

                    Promedio:
                    ${imagen.promedioVotos ?? 0}

                    (${imagen.cantidadVotos} votos)

                </p>

            </div>

        `;

        const estrellas = detalle.querySelectorAll('.estrella');

        const inputValor = detalle.querySelector('#valorSeleccionado');
        
        const rating = detalle.querySelector('.rating');

        const votoUsuario = imagen.votoUsuario || 0;

        inputValor.value = votoUsuario;

        pintar(votoUsuario);

             

        estrellas.forEach(estrella => {

            estrella.addEventListener('mouseenter', () => {

                const valor = Number(estrella.dataset.valor);

                pintar(valor);

            });

            estrella.addEventListener('click', () => {

                const valor =
                Number(estrella.dataset.valor);
                inputValor.value = valor;
                pintar(valor);
                enviarVoto(
                    imagen.idImagen,
                    valor
                );

                estrellas.forEach(estrella => {
                    estrella.style.pointerEvents = 'none';
                });
              
            });

        });

        


        rating.addEventListener('mouseleave', () => {

            const valorActual =
                Number(inputValor.value || 0);

            pintar(valorActual);

        });
    }

    renderizar(0);

    function pintar(valor){

        const estrellas = detalle.querySelectorAll('.estrella');

        estrellas.forEach(estrella => {

            if(
                Number(estrella.dataset.valor)
                <= valor
            ){

                estrella.classList.remove('bi-star');

                estrella.classList.add(
                    'bi-star-fill',
                    'text-warning'
                );

            }else{

                estrella.classList.remove(
                    'bi-star-fill',
                    'text-warning'
                );

                estrella.classList.add('bi-star');

            }

        });

    }
    

    async function enviarVoto(idImagen, valor){

        try{
            await fetch('/voto', {

                method: 'POST',

                headers: {
                    'Content-Type':
                    'application/json'
                },

                body: JSON.stringify({
                    idImagen,
                    valor
                })
                    
            });
            
        }catch(error){

            console.error(error);

        }

    }

    async function enviarComentario(idImagen, comentario){

        try{

            const response = await fetch('/comentario', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    idImagen,
                    comentario
                })

            });

            if(response.status === 401){

                window.location.href = '/auth/login';

                return;
            }

            if(!response.ok){

                throw new Error(
                    await response.text()
                );

            }

            return await response.json();

        }catch(error){

            console.error(error);

        }
    }

    document.querySelectorAll('.form-comentario')
        .forEach(form => {

            form.addEventListener(
                'submit',
                async e => {

                    e.preventDefault();

                    const idImagen =
                        form.querySelector(
                            '[name="idImagen"]'
                        ).value;

                    const comentarioInput =
                        form.querySelector(
                            '[name="comentario"]'
                        );

                    const comentario =
                        comentarioInput.value.trim();

                    if(!comentario){
                        return;
                    }

                    const resultado =
                        await enviarComentario(
                            idImagen,
                            comentario
                        );

                    if(resultado){

                        comentarioInput.value = '';

                        const listaComentarios = document.querySelector(`.lista-comentarios[data-imagen="${idImagen}"]`);

                        const comentarioHTML = `

                            <div class="d-flex align-items-start gap-2 mb-3">

                                <img
                                    class="rounded-circle"
                                    src= "${resultado.usuario.avatar || '/images/avatar-default.svg'}"
                                    width="40"
                                    height="40"
                                    style="object-fit: cover;"
                                >

                                <div>

                                    <p class="mb-1">

                                        <strong>
                                            ${resultado.usuario.nombre}
                                            ${resultado.usuario.apellido}
                                        </strong>

                                        ${resultado.comentario}

                                    </p>

                                </div>

                            </div>

                        `;                      

                        listaComentarios.insertAdjacentHTML(
                            'beforeend',
                            comentarioHTML
                        );

                        const pNoComentarios = document.getElementById('pNoComentarios');
                        pNoComentarios?.remove();

                        comentarioInput.value = '';
                }
                                        
                                        }
                                    );
                                
                });
    const carousel =
        document.getElementById(
            `carousel-${idPublicacion}`
        );

    carousel.addEventListener(
        'slid.bs.carousel',
        event => {
            renderizar(event.to);
        }
    );

});
