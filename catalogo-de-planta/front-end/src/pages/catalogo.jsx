import Header from "./widgets/Header";
import Catalogado from "./widgets/Catalogado";
import '../assets/styles/catalogo.css';
import filtroImg from "../assets/images/filtro.png";
import logo from "../assets/images/logoWikiPlant.png";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

import { useState, useEffect } from "react";

export default function Catalogo() {
   const apiUrl = import.meta.env.VITE_API_URL;
   const { isLoggedIn } = useAuth();
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
            console.error('Erro ao buscar plantas:', error);
         }
      }
      fetchPlantas();
   }, [apiUrl, searchParams]);

   function manusearMudancaFiltro(e) {
      setFiltro(e.target.value);
   }

   function carregarPlantas() {
      const filtradas = plantas.filter(element =>
         element.nome_comum?.toLowerCase().includes(filtro.toLowerCase()) ||
         element.genero?.toLowerCase().includes(filtro.toLowerCase())
      );

      if (filtradas.length === 0) {
         return <p style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>Nenhuma planta encontrada.</p>;
      }

      return (
         <div className="catalogoPlantas">
            {filtradas.map((element) => (
               <div
                  key={element.id}
                  onClick={() => setPlantaSelecionada(element)}
                  style={{ cursor: "pointer" }}
               >
                  <Catalogado
                     imagem_url={element.imagem_url}
                     nome_comum={element.nome_comum}
                     id_genero={element.id_genero}
                     genero={element.genero}
                     descricao={element.descricao}
                  />
               </div>
            ))}
         </div>
      );
   }

   async function excluirPlanta() {
      if (!isLoggedIn) {
         alert("Você precisa estar logado para excluir uma planta.");
         return;
      }

      if (!window.confirm("Tem certeza que deseja excluir esta planta?")) {
         return;
      }

      try {
         await axios.delete(`${apiUrl}/plants/${plantaSelecionada.id}`);

         setPlantas(prev =>
            prev.filter(planta => planta.id !== plantaSelecionada.id)
         );

         setPlantaSelecionada(null);
         alert("Planta excluída com sucesso.");
      } catch (error) {
         console.error("Erro ao excluir planta:", error);
         alert(error.response?.data?.error || "Não foi possível excluir a planta.");
      }
   }

   return (
      <div>
         <Header />
         <main>
            <h1 className="tituloPag">Catálogo de plantas</h1>

            {isLoggedIn && (
               <Link to={"/cadastrar-planta"} className="addBtn" title="Cadastrar nova planta">+</Link>
            )}

            <div className="pesquisa" id="pesquisa">
               <img src={filtroImg} alt="filtro" className="filtroImg"/>
               <input 
                  type="text"
                  className="pesquisaInput"
                  placeholder="Pesquisar por nome ou gênero..."
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
                        <img src={plantaSelecionada.imagem_url || logo} alt={plantaSelecionada.nome_comum} />
                     </div>

                     {/* TEXTO */}
                     <div className="modal-right">
                        <h1>{plantaSelecionada.nome_comum}</h1>
                        <h3>{plantaSelecionada.genero || `Gênero #${plantaSelecionada.id_genero}`}</h3>

                        <p>{plantaSelecionada.descricao}</p>

                        <div className="modal-botoes">
                           <button className="mapaBtn">
                              <Link to={`/maps?id=${plantaSelecionada.id}`}>
                                 Conferir no mapa
                              </Link>
                           </button>

                           {isLoggedIn && (
                              <button
                                 className="excluirBtn"
                                 onClick={excluirPlanta}
                              >
                                 Excluir planta
                              </button>
                           )}
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
   );
}
