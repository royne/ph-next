import React, {useEffect, useState} from 'react'
import Layout from '../Components/layout/Layout';
import {useRouter} from 'next/router'
import styled from '@emotion/styled'
import DetallesProducto from '../Components/layout/DetallesProducto';
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
const Buscar = () => {

  const router = useRouter()
  const { query: { q } } = router
  const productos = useProductos('creado')
  const [resultado, guardarResultado ] = useState([])
  
  useEffect(() => {
    const busqueda = q.toLowerCase()
    const filtro = productos.filter(elm => {
      return(
        elm.nombre.toLowerCase().includes(busqueda) || 
        elm.descripcion.toLowerCase().includes(busqueda)
      )
    })
    guardarResultado(filtro)
  }, [q, productos])

  return (
    <div>
      <Layout>
        <ListadoProductos>
          <div className="contenedor">
            <ul>
              {resultado.map(producto => (
                <DetallesProducto key={producto.id} producto={producto} />
              ))}
            </ul>
          </div>
        </ListadoProductos>
      </Layout>
    </div>
  )
}

export default Buscar