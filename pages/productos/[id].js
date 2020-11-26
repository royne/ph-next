import React, {useEffect, useContext, useState} from 'react';
import Layout from '../../Components/layout/Layout'
import Error404 from '../../Components/layout/Error404'
import { useRouter } from 'next/router'
import { FirebaseContext } from '../../firebase'
import {css} from '@emotion/react' 
import styled from '@emotion/styled' 
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import {Campo, ImputSubmit} from '../../Components/ui/Formulario'
import Boton from '../../Components/ui/Boton'


const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display:grid;
    grid-template-columns: 2fr 1fr;
    column-gap:2rem;
  }
`

const Producto = () => {
  const [producto, guardarProducto] = useState({})
  const [error, guardarError] = useState(false)
  const [comentario, guardarComentario] = useState({})
  const [consultaDb, gaurdarConsultaDb] = useState(true)

  const router = useRouter()
  const { query: { id }} = router

  const {firebase, usuario} = useContext(FirebaseContext)

  useEffect(() => {
    if (id && consultaDb) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection('productos').doc(id)
        const producto = await productoQuery.get()
        if(producto.exists){
          guardarProducto(producto.data())
          gaurdarConsultaDb(false)
        }else{
          guardarError(true)
          gaurdarConsultaDb(false)
        }
      }
      obtenerProducto()
    }
  }, [id])

  if(Object.keys(producto).length === 0 && !error) return <Layout><p>Cargando.....</p></Layout>

  const { comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos, creador, haVotado } = producto;

  // administrar y validar votos
  const botarProducto = () => {
    if(!usuario) return router.push('/login')
    // obtener y sumar nuevo voto
    const nuevoTotal = votos + 1
    // verificar si el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) return
    // guardar id usuario que voto
    const nuevoHaVotado = [...haVotado, usuario.uid]
    // actualiza db
    firebase.db.collection('productos').doc(id).update({
      votos: nuevoTotal,
      haVotado: nuevoHaVotado
    })
    // actualiza state
    guardarProducto({
      ...producto,
      votos: nuevoTotal
    })
    gaurdarConsultaDb(true)
  }

  // funciones para comentarios
  const comentarioChange = e => {
    guardarComentario({
      ...comentario,
      [e.target.name] : e.target.value
    })
  }
  
  const agregarComentario = e => {
    e.preventDefault()
    if(!usuario) return router.push('/login')
    comentario.usuarioId = usuario.uid,
    comentario.usuarioNombre = usuario.displayName
    const nuevosComentarios = [...comentarios, comentario]
    firebase.db.collection('productos').doc(id).update({
      comentarios: nuevosComentarios
    })
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios
    })  
  }

  const puedeBorrar = () => {
    if(!usuario) return false
    if(creador.id === usuario.uid) return true
  }

  const eliminarProducto = async () => {
    if (!usuario) return router.push('/login')
    if (creador.id === usuario.uid) return router.push('/')
    try {
      await firebase.db.collection('productos').doc(id).delete()
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return ( 
    <Layout>
      <>
        {error ? <Error404 /> : (
          <div className="contenedor">
            <h1 css={css`
              text-align:center;
              margin-top:3rem;
            `}>{nombre}</h1>

            <ContenedorProducto>
              <div>
                <p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })} </p>
                <p>Por {creador.nombre} de {empresa}</p>
                <img src={urlImagen} />
                <p>{descripcion}</p>

                { usuario && 
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input 
                          type="text" 
                          name="mensaje"
                          onChange={comentarioChange} />
                      </Campo>
                      <ImputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                }

                <h2 css={css`margin:2rem 0;`}>Comentarios</h2>
                {comentarios.length === 0 ? "Aún no hay comentarios" : 
                  (
                  <ul>
                    {comentarios.map((elm, i) => (
                      <li 
                        key={`${elm.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}>
                        <p>{elm.mensaje}</p>
                        <p>Escrito por: {''}<span>{elm.usuarioNombre}</span></p>
                      </li>
                    ))}
                  </ul> 
                  )            
                }
              </div>
              <aside>
                <Boton 
                  target="_blank"
                  bgColor="true"
                  href={url}>Visitar Url</Boton>
                <p css={css`text-align:center;`}>{votos} Votos</p>
                {usuario && <Boton onClick={botarProducto}>Votar</Boton> }
              </aside>
            </ContenedorProducto>
            {puedeBorrar() && 
              <Boton onClick={eliminarProducto}>Eliminar producto</Boton>
            }
          </div>
        )}
      </>
    </Layout>
   );
}
 
export default Producto;