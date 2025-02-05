const chat = document.getElementById('chat')
const divEscribiendoOtraPersona = document.getElementById('escribiendoOtraPersona')
const puntosEscribiendoOtraPersona = divEscribiendoOtraPersona.getElementsByTagName('span')
const divElecciones = document.getElementById('divElecciones')
const btnIrAElegir = document.getElementById('btnRegresarAElegir')
const btnRegresarAChat = document.getElementById('btnRegresarAChat')
const fondo = document.getElementById('fondo')
const body = document.querySelector('body')
const main = document.querySelector('main')
let autorMensajeAnterior
let autorMensajeAnteriorAUsar

btnIrAElegir.addEventListener('click', ()=>{
    divElecciones.style.display='flex'
    main.style.filter='blur(5px)'
    fondo.style.filter='blur(5px)'
    btnIrAElegir.style.display=''
})

divElecciones.addEventListener('click', (e)=>{
    if(e.target.id=='divElecciones'){
        divElecciones.style.display='none'
        btnIrAElegir.style.display='unset'
        main.style.filter='blur(0)'
         fondo.style.filter='blur(0)'
    }
})

btnRegresarAChat.addEventListener('click', ()=>{
    divElecciones.style.display='none'
    btnIrAElegir.style.display='unset'
    main.style.filter='blur(0)'
    fondo.style.filter='blur(0)'
})
puntosEscribiendoOtraPersona[0].style.animation = 'escribiendoMensaje infinite 2s'
setTimeout(()=>{
    puntosEscribiendoOtraPersona[1].style.animation = 'escribiendoMensaje infinite 2s'
}, 250)
setTimeout(()=>{
    puntosEscribiendoOtraPersona[2].style.animation = 'escribiendoMensaje infinite 2s'
}, 500)

function procesarMensajesDosPersonas(arrayMensajes, funcFinal){
    /*Formato en que debe estar el array con los mensajes:
    [{
        clase : 'mensajePropio',
        texto : '',
        hora : '00:00 am'
    }, 
    {
        clase : 'mensajeOtraPersona',
        texto : '',
        hora : '00:00 pm'
    }, 
    {   
        img : 'img',
        clase : '',
        src : ''
    },
    {
        img : 'stickers',
        clase : '',
        src : []
    },
    ]*/
    const cantidadDeMensajes = arrayMensajes.length
    let indiceActual = 0
    function procesarMensajesUnoPorUno(){
        if (indiceActual<cantidadDeMensajes){
            const objetoDatosMensaje = arrayMensajes[indiceActual]
            const clase = objetoDatosMensaje.clase
            const divMensajeCompleto = document.createElement('div')
            
            if(autorMensajeAnterior!=clase){
                divMensajeCompleto.style.marginTop='4px'
                autorMensajeAnteriorAUsar=autorMensajeAnterior
                autorMensajeAnterior=clase
            }
            else{
                autorMensajeAnteriorAUsar=autorMensajeAnterior
            }

            if (objetoDatosMensaje.img=='img'){
                divMensajeCompleto.classList.add(clase)
                let x = 0
                if (clase=='mensajePropio'){
                    divEscribiendoOtraPersona.style.right='100vw'
                }
                else{
                    divEscribiendoOtraPersona.style.marginTop=divMensajeCompleto.style.marginTop
                    x = 2000
                    setTimeout(()=>{
                        divEscribiendoOtraPersona.style.right=0;
                    }, 2000)
                }
                const src=objetoDatosMensaje.src
                divMensajeCompleto.classList.add('divImgChat')
                const imgACrear = document.createElement('img')
                divMensajeCompleto.append(imgACrear)
                imgACrear.src=src
                divMensajeCompleto.addEventListener('click', ()=>{
                    const contenedorImgGrande=document.createElement('div')
                    contenedorImgGrande.classList.add('contenedorImgGrande')
                    const imgGrande=document.createElement('img')
                    imgGrande.classList.add('imgGrande')
                    imgGrande.src=src
                    contenedorImgGrande.append(imgGrande)
                    main.style.filter='blur(5px)'
                    fondo.style.filter='blur(5px)'
                    contenedorImgGrande.addEventListener('click', ()=>{
                        main.style.filter='blur(0)'
                        fondo.style.filter='blur(0)'
                        contenedorImgGrande.remove()
                    })
                    body.append(contenedorImgGrande)
                })

                setTimeout(()=>{
                    chat.insertBefore(divMensajeCompleto, btnIrAElegir)
                    indiceActual++
                    procesarMensajesUnoPorUno()
                }, 6000 + x)
            }
            else if (objetoDatosMensaje.img=='stickers'){
                divMensajeCompleto.classList.add('contenedorStickers')

                if(clase=='mensajePropio'){
                    divMensajeCompleto.style.alignSelf='flex-end'
                    divMensajeCompleto.style.justifyContent='flex-end'
                    divEscribiendoOtraPersona.style.right='100vw'
                }
                else{
                    divMensajeCompleto.style.alignSelf='flex-start'
                    divMensajeCompleto.style.justifyContent='flex-start'
                }
                chat.insertBefore(divMensajeCompleto, btnIrAElegir)
                const src = objetoDatosMensaje.src
                let nroSticker=0

                if(autorMensajeAnteriorAUsar!=clase && clase=='mensajeOtraPersona'){
                    setTimeout(()=>{
                        agregarStickers()
                    }, 3000)
                }
                else{
                    agregarStickers()
                }

                function agregarStickers(){
                    if(clase=='mensajeOtraPersona'){
                        divEscribiendoOtraPersona.style.right=0
                    }
                    setTimeout(()=>{
                        const intervaloStickers = setInterval(() => {
                            if(nroSticker<src.length-1){
                                const sticker = document.createElement('img')
                                sticker.src=src[nroSticker]
                                sticker.classList.add('sticker')
                                divMensajeCompleto.append(sticker)
                                nroSticker++
                            }
                            else{
                                const sticker = document.createElement('img')
                                sticker.src=src[nroSticker]
                                sticker.classList.add('sticker')
                                divMensajeCompleto.append(sticker)
                                indiceActual++
                                clearInterval(intervaloStickers)
                                procesarMensajesUnoPorUno()
                            }
                        }, 2000);
                    }, 1000)
                }
            }

            else if(objetoDatosMensaje.img==undefined){
                divMensajeCompleto.classList.add(clase)
                divMensajeCompleto.classList.add('mensaje')
                divEscribiendoOtraPersona.style.marginTop=divMensajeCompleto.style.marginTop
                const texto = document.createElement('h5')
                const textoInvisible = document.createElement('span')
                textoInvisible.classList.add('textoInvisible')
                const textoVisible = document.createElement('span')
    
            const hora = document.createElement('h6')
            hora.classList.add('horaMensaje')
            hora.innerText = objetoDatosMensaje.hora
    
            divMensajeCompleto.append(texto)
            divMensajeCompleto.append(hora)
            indiceActual++

            let cantidadDeLetras = objetoDatosMensaje.texto.length

            if (clase == 'mensajeOtraPersona'){

                texto.innerText = objetoDatosMensaje.texto
                let tiempoDeEscritura
                if (cantidadDeLetras<26){
                    tiempoDeEscritura=2500
                }
                else if(cantidadDeLetras<80){
                    tiempoDeEscritura=4000
                }
                else{
                    tiempoDeEscritura=6000
                }

                if(autorMensajeAnteriorAUsar!='mensajeOtraPersona'){
                    setTimeout(()=>{
                        divEscribiendoOtraPersona.style.right='0'
                        setTimeout(mostrarMensaje, tiempoDeEscritura) 
                    }, 4000)
                }
                else{
                    setTimeout(mostrarMensaje, tiempoDeEscritura)
                }
            }

            else{
                divEscribiendoOtraPersona.style.right='100vw'
                textoInvisible.innerText=objetoDatosMensaje.texto
                texto.append(textoVisible)
                texto.append(textoInvisible)

                if (autorMensajeAnteriorAUsar!='mensajePropio'){
                    setTimeout(mostrarMensaje, 3500)
                }
                else{
                    setTimeout(mostrarMensaje, 1000)
                }
            }
            
            function mostrarMensaje(){
                chat.insertBefore(divMensajeCompleto, btnIrAElegir)

                if (chat.offsetWidth*0.7-100>divMensajeCompleto.offsetWidth){
                    divMensajeCompleto.style.display='flex'
                }

                if(clase=='mensajePropio'){
                    const intervaloDeEscritura = setInterval(()=>{
                        if (textoInvisible.innerText.length>0){
                            if (textoInvisible.innerText[0]!=' '){
                                textoVisible.innerText=`${textoVisible.innerText}${textoInvisible.innerText[0]}`
                                textoInvisible.innerText=textoInvisible.innerText.substring(1)
                            }
                            else {
                                textoVisible.innerText=`${textoVisible.innerText} ${textoInvisible.innerText[1]}` 
                                textoInvisible.innerText=textoInvisible.innerText.substring(2)
                            }
                        }
                        else{
                            clearInterval(intervaloDeEscritura)
                            procesarMensajesUnoPorUno()
                        }
                    },85)
                }
                else{
                    procesarMensajesUnoPorUno()
                }
            }
            }
        }    
        else{
            divEscribiendoOtraPersona.style.right='100vw'
            funcFinal()
        }
    }
    procesarMensajesUnoPorUno()
}

function realizarElección(arrayDeElecciones){
    /*Formato en que debe estar el array de las posibles elecciones
    [{
        elegir:" texto que sale a escoger 1",
        respuesta:()=>{
            instrucciones que se ejecutan, pudiendo llamar una función que procesa los mensajes, o una img
        }
    },
    {
        elegir:'segunda elección posible',
        respuesta: ()=>{
            instrucciones para la segunda elección
        }
    }
]*/ 
    for (const unaDeLasElecciones of arrayDeElecciones){
        const btnIndividual = document.createElement('button')
        btnIndividual.type='button'
        btnIndividual.innerText = unaDeLasElecciones.elegir
        btnIndividual.classList.add('btnElecciones')
        btnIndividual.classList.add('btnChat')
        btnIndividual.addEventListener('click',()=>{
            unaDeLasElecciones.respuesta()
            divElecciones.style.display='none'
            const btnsDeElecciones = divElecciones.getElementsByClassName('btnElecciones')
            while (btnsDeElecciones.length>0){
                btnsDeElecciones[0].remove()
            }
            main.style.filter='blur(0)'
             fondo.style.filter='blur(0)'
        })
        divElecciones.append(btnIndividual)
        }
    btnIrAElegir.style.display='unset'
}


const mensajes1 = [
    {
        clase : 'mensajeOtraPersona',
        texto : 'heyyy',
        hora : '10:44 pm'
    }, 
    {
        clase : 'mensajeOtraPersona',
        texto : 'qué tal estás?',
        hora : '10:44 pm'
    }, 
    {
        clase : 'mensajePropio',
        texto : 'holaaa :)',
        hora : '10:45 pm'
    }, 
    {
        clase : 'mensajePropio',
        texto : 'bien, y tú?',
        hora : '10:45 pm'
    }, 
    {
        clase : 'mensajeOtraPersona',
        texto : 'genuall, te tengo que hacer una pregunta muy importante...',
        hora : '10:45 pm'
    }, 
    {
        clase : 'mensajeOtraPersona',
        texto : '*genial',
        hora : '10:45 pm'
    }, 
    {
        clase : 'mensajeOtraPersona',
        texto : 'finalmente vas a Puerto Escondido?',
        hora : '10:46 pm'
    }, 
]

const mensajes2p1 = [
    {
        clase : 'mensajePropio',
        texto : 'a Puerto Escondido?',
        hora : '10:46 pm'
    }, 
    {
        clase : 'mensajeOtraPersona',
        texto : 'sí',
        hora : '10:46 pm'
    }, 
    {
        clase : 'mensajePropio',
        texto : 'qué día?',
        hora : '10:46 pm'
    }, 
    {
        clase : 'mensajeOtraPersona',
        texto : 'vamos los días 15, 16 y 17 del mes que viene',
        hora : '10:47 pm'
    }, 
    {
        clase : 'mensajeOtraPersona',
        texto : 'no hay excusas',
        hora : '10:47 pm'
    }, 
    {
        img : 'stickers',
        clase : 'mensajeOtraPersona',
        src : ['st3.webp']
    },
]
const mensajes2p2=[
    {
        clase : 'mensajePropio',
        texto : 'no tengo ganas',
        hora : '10:46 pm'
    }, 
    {
        img : 'stickers',
        clase : 'mensajeOtraPersona',
        src : ['st1.png']
    },
    {
        clase : 'mensajeOtraPersona',
        texto : 'te voy a mandar par de fotos para que te animes',
        hora : '10:47 pm'
    }, 
    {
        clase : 'mensajeOtraPersona',
        texto : 'y te acuerdes de la vez pasada',
        hora : '10:47 pm'
    }, 
    {   
        img : 'img',
        clase : 'mensajeOtraPersona',
        src : '1.webp'
    },
    {   
        img : 'img',
        clase : 'mensajeOtraPersona',
        src : '2.webp'
    },
    {
        clase : 'mensajeOtraPersona',
        texto : 'si cambias de idea me vuelves a escribir..... amargado',
        hora : '10:47 pm'
    }, 
]
const elección1 = [{
    elegir:"puerto escondido? qué día?",
    respuesta:()=>{
        procesarMensajesDosPersonas(mensajes2p1, ()=>{
            console.log('fin')
        })
    }
},
{
    elegir:'no tengo ganas',
    respuesta: ()=>{
        procesarMensajesDosPersonas(mensajes2p2, ()=>{
            console.log('fin')
        })
    }
}
]

procesarMensajesDosPersonas(mensajes1, ()=>{realizarElección(elección1)})