import { Button } from "flowbite-react";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";


interface IHeaderButtons {
  setCurrentModal: (modalName:string)=>void;
}
const HeaderButtons:React.FC<IHeaderButtons> = ({setCurrentModal}) =>{
  const {logout} = useContext(AuthContext);
    return(
        <div className="flex gap-4 w-full justify-center my-4 align-middle">
        <Button
          onClick={(e) => {
            setCurrentModal("adicionar_tarefa");
          }}
        >
          Adicionar Tarefa
        </Button>
        <Button
          onClick={(e) => {
            setCurrentModal("buscar_tarefa");
          }}
        >
          Buscar Tarefa
        </Button>
        <Button onClick={logout}>Logout</Button>
      </div>
    )
}

export default HeaderButtons