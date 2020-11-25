import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import uuid from 'react-uuid'
import Layout from '../Components/layout/Layout';
import { Formulario, Campo, ImputSubmit, Error } from '../Components/ui/Formulario';

import { FirebaseContext } from '../firebase';

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validaciones/validarCrearProducto';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  // state de las imagenes
  const [uploadValue, setUploadValue] = useState(0);
  const [nombreImagen, guardarNombreImagen] = useState('');


  const [error, guardarError] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  // hook de routing para redireccionar
  const router = useRouter();

  // context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearProducto() {

    // si el usuario no esta autenticado llevar al login
    if (!usuario) {
      return router.push('/login');
    }

    const urlImagen = await nombreImagen.getDownloadURL()

    // crear el objeto de nuevo producto 
    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now()
    }

    // insertarlo en la base de datos
    if (producto.urlImagen){
      firebase.db.collection('productos').add(producto);
    }

    return router.push('/');

  }

  const handleUploadSuccess = e => {
    const file = e.target.files[0]
    const storageRef = firebase.storage.ref("productos").child(uuid())
    const task = storageRef.put(file)

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setUploadValue(percentage)
    }, error => {
      console.error(error.message);
    }, () => {
        guardarNombreImagen(storageRef)
        console.log(storageRef);
    })
  };

  return (
    <div>
      <Layout>
        {!usuario ? <p>no existe usuario</p> : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo Producto</h1>
            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >

              <fieldset>
                <legend>Información General </legend>

                <Campo>
                  <label htmlFor="nombre">Nombre producto</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del Producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Nombre Empresa o Compañia"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    onChange={handleUploadSuccess}
                  />
                </Campo>
                <Campo>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    placeholder="URL de tu producto"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.url && <Error>{errores.url}</Error>}

              </fieldset>

              <fieldset>
                <legend>Sobre tu Producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripcion</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>




              {error && <Error>{error} </Error>}

              <ImputSubmit
                type="submit"
                value="Crear Producto"
              />
            </Formulario>
          </>
        )}

      </Layout>
    </div>
  )
}

export default NuevoProducto