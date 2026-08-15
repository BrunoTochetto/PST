import Header from "./widgets/Header";
import Catalogado from "./widgets/Catalogado";
import '../assets/styles/catalogo.css';
import filtroImg from "../assets/images/filtro.png"
import logo from "../assets/images/logoWikiPlant.png"
import { Link, useSearchParams } from "react-router-dom";
import axios from 'axios';

import { useState, useEffect } from "react";

export default function Catalogo() {
   const apiUrl = import.meta.env.VITE_API_URL;
   const [filtro, setFiltro] = useState('');
   const [plantas, setPlantas] = useState([]);
   const [plantaSelecionada, setPlantaSelecionada] = useState(null);
   const [searchParams] = useSearchParams();

   useEffect(() => {
      async function fetchPlantas() {
         try {
            const response = await axios.get(`${apiUrl}/plants`);
            const semValoresNulos = response.data.filter(element => element.nome_comum != null);
            setPlantas(semValoresNulos);

            // Verificar se tem parâmetro id na URL
            const plantaId = searchParams.get('id');
            if (plantaId) {
               const planta = semValoresNulos.find(p => p.id === parseInt(plantaId));
               if (planta) {
                  setPlantaSelecionada(planta);
               }
            }
         } catch (error) {
            console.error('Erro:', error);
         }
      }
      fetchPlantas();
   }, [apiUrl, searchParams]);

   function manusearMudancaFiltro(e) {
      setFiltro(e.target.value)
   }

   // * Para cada planta carregada, tem q chamar a função Catalogado
   function carregarPlantas() {
      return (
         <div className="catalogoPlantas">
            {
            plantas
               .filter(element =>
                  element.nome_comum?.toLowerCase().includes(filtro.toLowerCase())
               )
               .map((element) => (
                  <div
                  key={element.id}
                  onClick={() => setPlantaSelecionada(element)}
                  >
                  <Catalogado
                     imagem_url={element.imagem_url}
                     nome_comum={element.nome_comum}
                     id_genero={element.id_genero}
                     descricao={element.descricao}
                  />
                  </div>
               ))
            }
         </div>
      );
      }

      async function excluirPlanta() {
         if (!window.confirm("Tem certeza que deseja excluir esta planta?")) {
            return;
         }

         try {
            await axios.delete(`${apiUrl}/plants/${plantaSelecionada.id}`);

            setPlantas(prev =>
               prev.filter(planta => planta.id !== plantaSelecionada.id)
            );

            setPlantaSelecionada(null);
         } catch (error) {
            console.error("Erro ao excluir planta:", error);
            alert("Não foi possível excluir a planta.");
         }
      }


   return (
      <div>
         <Header />
         <main>
            <h1 className="tituloPag">Catálogo de plantas</h1>

            <Link to={"/cadastrar-planta"} className="addBtn">+</Link>

            <div class="pesquisa" id="pesquisa">
               <img src={filtroImg} alt="filtro" className="filtroImg"/>
               <input 
                  type="text"
                  className="pesquisaInput"
                  placeholder="Pesquisar planta..."
                  value={filtro}
                  onChange={manusearMudancaFiltro} 
               />
               
            </div>

            <section>
               {carregarPlantas()}
            </section>

            {plantaSelecionada && (
               <div
                  className="modal-overlay"
                  onClick={() => setPlantaSelecionada(null)}
               >
                  <div
                     className="modal-content"
                     onClick={(e) => e.stopPropagation()}
                  >
                     {/* IMAGEM */}
                     <div className="modal-left">
                     <img src={plantaSelecionada.imagem_url || logo} />
                     </div>

                     {/* TEXTO */}
                     <div className="modal-right">
                     <h1>{plantaSelecionada.nome_comum}</h1>
                     <h3>{plantaSelecionada.id_genero}</h3>

                     <p>{plantaSelecionada.descricao}</p>

                     <span>Por: usuário</span>

                     <div className="modal-botoes">
                        <button className="mapaBtn">
                           <Link to={`/maps?id=${plantaSelecionada.id}`}>
                              Conferir no mapa
                           </Link>
                        </button>

                        <button
                           className="excluirBtn"
                           onClick={excluirPlanta}
                        >
                           Excluir planta
                        </button>
                     </div>
                     </div>
                  </div>
               </div>
               )}


            <div className="proximaPagina">
               <p> {"< 00 | 00 >"}  </p>
            </div>

         </main>
         <footer></footer>
      </div>
   )
}