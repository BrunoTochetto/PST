import '../../assets/styles/catalogo.css';
import logo from '../../assets/images/logoWikiPlant.png';

export default function Catalogado({imagem_url, nome_comum, nome_genero, descricao, key}) {
   return (
      <div className="catalogado" key={key}>
         <img src={imagem_url || logo} alt="" />
         <h1>{nome_comum}</h1>

         <div className="infoPlanta">
            <h3>Gênero: {nome_genero}</h3>
            <p>{descricao}</p>
         </div>
      </div>
   );
}