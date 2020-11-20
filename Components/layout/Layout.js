import React from 'react';
import Link from 'next/link'

const Layout = props => {
  return ( 
    <>
      <h1>header</h1>
      <nav>
        <Link href="/">inicio</Link>
        <Link href="/nosotros">Nosotros</Link>
      </nav>
      <main>
        {props.children}
      </main>
    </>
   );
}
 
export default Layout;