import Header from "./widgets/Header";
import Catalogado from "./widgets/Catalogado";
import '../assets/styles/catalogo.css';

import { useState } from "react";

export default function Catalogo() {

   const [filtro, setFiltro] = useState(' ');

   function manusearMudancaFiltro(e) {
      setFiltro(e.target.value)
   }

   // * Para cada planta carregada, tem q chamar a função Catalogado
   function carregarPlantas() {
      const plantas = [
         {
            nome: 'ola',
            key: 1
         },
         {
            nome: 'denovo',
            key: 2
         }
      ]

      return(
         <div>
            {plantas.map(element => (
               Catalogado(element)
            ))}
         </div>
         
      )
   }


   return (
      <div>
         <Header />
         <main>

            <h1>Catálogo de plantas - Cidade</h1>

            <div id="pesquisa">
               <p>Foto</p>
               <input type="text" id="pesquisa" value={filtro} onChange={manusearMudancaFiltro} />
            </div>

            <section>
               {carregarPlantas()}
            </section>

         </main>
         <footer></footer>
      </div>
   )
}