import React, {useEffect, useState, useContext} from 'react'
import styled from '@emotion/styled'
import DetallesProducto from '../Components/layout/DetallesProducto';
import Layout from '../Components/layout/Layout';
import { FirebaseContext } from '../firebase'

const ListadoProductos  = styled.div`
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

const Home = () => {
  const [productos, guardarProductos] = useState([])

  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = () => {
      firebase.db.collection('productos').orderBy('creado', 'desc').onSnapshot(manejarProducto)
    }
    obtenerProductos()
  }, [])

  function manejarProducto(snapshot) {
    const productos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    guardarProductos(productos)
  }

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

export default Home