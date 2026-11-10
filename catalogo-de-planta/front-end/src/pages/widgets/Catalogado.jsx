import '../../assets/styles/catalogo.css';
import logo from '../../assets/images/logoWikiPlant.png';

export default function Catalogado({ imagem_url, nome_comum, id_genero, genero, descricao }) {
   return (
      <div className="catalogado">
         <img src={imagem_url || logo} alt={nome_comum || "Planta"} />
         <h1>{nome_comum}</h1>

         <div className="infoPlanta">
            <h3>Gênero: {genero || id_genero || "Não informado"}</h3>
            <p>{descricao}</p>
         </div>
      </div>
   );
}
