// Componente criado com base no livro React fluent de Tejas Kumar
// Adaptado por José Caldas Gois Júnior goisjr@cgadv.com.br

// Importa as bibliotecas e hooks
import React,{useState} from "react";

// Cria a função LikeButton
export function LikeButton() {

	// Seta os props dentro de usesState
	const [likes, setlikes] = useState(0);

	// Cria a função handleLike que será chamada quando o usuário apertar o botão	
	function handleLike(){
		// Incrementa o estado em 1
		setlikes(likes+1);
	}
	// Renderiza o HTMLes
	return (
		<div>
		       <button onClick={handleLike}>Curtir</button>
			<p>{likes} Curtidas</p>
		</div>
		);
}

