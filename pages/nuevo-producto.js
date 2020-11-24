import React, { useState, useContext } from 'react'
import { css } from '@emotion/react';
import Router, {useRouter} from 'next/router'
import Layout from '../Components/layout/Layout';
import { Formulario, Campo, ImputSubmit, Error } from '../Components/ui/Formulario';
import {FirebaseContext} from '../firebase'
import useValidacion from '../hooks/useValidacion'
import validarCrearProducto from '../validaciones/validarCrearProducto'

const NuevoProducto = () => {
  const [error, guardarError] = useState(false)

  const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    // imagen: '',
    url: '',
    descripcion: ''
  }

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto)

  const { nombre, empresa, imagen, url, descripcion } = valores

  // hook routing
  const router = useRouter()

  // context para  firebase
  const { usuario, firebase } = useContext(FirebaseContext)
  
  async function crearProducto() {
    // si el usuario no esta autenticado 
    if(!usuario){
      return router.push('login')
    }
    // crear producto
    const producto = {
      nombre,
      empresa,
      url,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now()
    }
    // insertar producto en db
    firebase.db.collection('productos').add(producto)
  }

  
  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}  >Nuevo producto</h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>informacion general</legend>
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Tunombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur} />
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}
              <Campo>
                <label htmlFor="empresa">empresa</label>
                <input
                  type="text"
                  id="empresa"
                  placeholder="nombre empresa"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur} />
              </Campo>
              {errores.empresa && <Error>{errores.empresa}</Error>}
              {/* <Campo>
                <label htmlFor="imagen">imagen</label>
                <input
                  type="file"
                  id="imagen"
                  placeholder="imagen"
                  name="imagen"
                  value={imagen}
                  onChange={handleChange}
                  onBlur={handleBlur} />
              </Campo>
              {errores.imagen && <Error>{errores.imagen}</Error>} */}
              <Campo>
                <label htmlFor="url">url</label>
                <input
                  type="url"
                  id="url"
                  placeholder="url"
                  name="url"
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur} />
              </Campo>
              {errores.url && <Error>{errores.url}</Error>}
            </fieldset>
            <fieldset>
              <legend>sobre tu producto</legend>
              <Campo>
                <label htmlFor="descripcion">descripcion</label>
                <textarea
                  id="descripcion"
                  placeholder="descripcion"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur} />
              </Campo>
              {errores.descripcion && <Error>{errores.descripcion}</Error>}

            </fieldset>
            
            {error && <Error>{error}</Error>}
            <ImputSubmit
              type="submit"
              value="Crear producto" />
          </Formulario>
        </>
      </Layout>
    </div>
  )
}

export default NuevoProducto