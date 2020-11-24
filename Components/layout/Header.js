import React, {useContext} from 'react';
import Link from "next/link";
import Buscar from "../ui/Buscar";
import Navegacion from "./Navegacion";
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Boton from '../ui/Boton'
import { FirebaseContext } from '../../firebase'

const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`

const Logo = styled.p`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: 'Roboto', serif;
  margin-right: 2rem;
  cursor: pointer;
`

const Header = () => {
  const {usuario, firebase } = useContext(FirebaseContext)

  return ( 
    <header 
      css={css`
        border-bottom: 2px solid var(--gris3);
        padding: 1rem 0;
      `} >
      <ContenedorHeader>
        <div 
          css={css`
            display: flex;
            align-items: center;
          `}>
          <Link href="/">
            <Logo>P</Logo>
          </Link>
          <Buscar />
          <Navegacion />
        </div>
        <div 
          css={css`
            display: flex;
            align-items: center;
          `} >
          { usuario ? (
            <>
              <p
                css={css`
                  margin-right:2rem;

              `} >hola {usuario.displayName}</p>
              <Boton 
                bgColor='true'
                onClick={() => firebase.cerrarSesion()}>Cerrar sesion</Boton>
            </>
          ) : (
            <>
              <Link href="/login">
                <Boton bgColor='true' >Login</Boton>
              </Link>
              <Link href="/crear-cuenta">
                <Boton>Cear cuenta</Boton>
              </Link>
            </>
          ) }
          
        </div>
      </ContenedorHeader>
    </header>
   );
}
 
export default Header;