import React from 'react'
import styled from '@emotion/styled'
import DetallesProducto from '../Components/layout/DetallesProducto';
import Layout from '../Components/layout/Layout';
import useProductos from '../hooks/useProductos'

const ListadoProductos = styled.div`
  background-color: #f3f3f3;
  .contenedor{
    max-width: 1200px;
    width: 95%;
    padding: 5rem 0;
    margin: 0 auto;
    ul{
      background-color: #FFF;
    }
  }
`

const Populares = () => {
  const productos = useProductos('votos')

  return (
    <div>
      <Layout>
        <ListadoProductos>
          <div className="contenedor">
            <ul>
              {productos.map(producto => (
                <DetallesProducto key={producto.id} producto={producto} />
              ))}
            </ul>
          </div>
        </ListadoProductos>
      </Layout>
    </div>
  )
}

export default Populares