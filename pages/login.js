import React, { useState } from 'react'
import { css } from '@emotion/react';
import Router from 'next/router'
import Layout from '../Components/layout/Layout';
import { Formulario, Campo, ImputSubmit, Error } from '../Components/ui/Formulario';
import firebase from '../firebase'
import useValidacion from '../hooks/useValidacion'
import validarIniciarSesion from '../validaciones/validarIniciarSesion'

const Login = () => {
  const [error, guardarError] = useState(false)

  const STATE_INICIAL = {
    email: '',
    password: ''
  }

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion)

  async function iniciarSesion() {
    try {
      await firebase.login(email, password)
      Router.push('/')
    } catch (error) {
      console.error('Hubo un error al autenticar usuario', error.message);
      guardarError(error.message)
    }
  }

  const {email, password } = valores

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}  >Login</h1>
          <Formulario onSubmit={handleSubmit} noValidate>
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
              value="Iniciar Sesión" />
          </Formulario>
        </>
      </Layout>
    </div>
  )
}

export default Login