import React, {useState} from 'react'
import { css } from '@emotion/react';
import Router from 'next/router'
import Layout from '../Components/layout/Layout';
import { Formulario, Campo, ImputSubmit,  Error } from '../Components/ui/Formulario';
import firebase from '../firebase'
import useValidacion from '../hooks/useValidacion'
import validarCrearCuenta from '../validaciones/validarCrearCuenta'


const CrearCuenta = () => {

  const [error, guardarError] = useState(false)

  const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
  }

  const { valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta)

  async function crearCuenta () {
    try {
      await firebase.registrar(nombre, email, password)
      Router.push('/')
    } catch (error) {
      console.error('Hubo un error al crear usuario', error.message);
      guardarError(error.message)
    }
  }

  const { nombre, email, password } = valores

  return (
    <div>
      <Layout>
        <>
          <h1 
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}  >crear cuenta</h1>
          <Formulario onSubmit={handleSubmit} noValidate>
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
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                id="email"
                placeholder="email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur} />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="password">password</label>
              <input 
                type="password"
                id="password"
                placeholder="password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur} />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            {error && <Error>{error}</Error>}
            <ImputSubmit 
              type="submit"
              value="Crear Cuenta" />
          </Formulario>
        </>
      </Layout>
    </div>
  )
}

export default CrearCuenta