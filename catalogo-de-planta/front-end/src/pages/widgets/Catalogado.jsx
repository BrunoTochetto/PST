

export default function Catalogado({nome, key}) {
   return (
      <div className="catalogado" key={key}>
         <h1>{nome}</h1>
      </div>
   );
}