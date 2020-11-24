import React from 'react'
import { css } from '@emotion/react';
import Layout from '../Components/layout/Layout';
import { Formulario, Campo, ImputSubmit } from '../Components/ui/Formulario';

const CrearCuenta = () => {

  return (
    <div>
      <Layout>
        <>
          <h1 
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}  >crear cuenta</h1>
          <Formulario>
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input 
                type="text"
                id="nombre"
                placeholder="Tunombre"
                name="nombre" />
            </Campo>
            <Campo>
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                id="email"
                placeholder="email"
                name="email" />
            </Campo>
            <Campo>
              <label htmlFor="password">password</label>
              <input 
                type="password"
                id="password"
                placeholder="password"
                name="password" />
            </Campo>
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