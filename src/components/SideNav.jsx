import { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils";

export default function SideNav(props) {
  const { selectedPokemon, setSelectedPokemon, showSideMenu, handleToggleSideMenu , handleCloseMenu } = props;
  const [searchValue, setSearchValue] = useState("");
 

const filterPokemon=first151Pokemon.filter(
    (pokemon, pokemonIndex) =>{
       if(getFullPokedexNumber(pokemonIndex).includes(searchValue)) return true;
        return pokemon.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    });
return (
    <nav className={''+(showSideMenu ? "open" : "")}>
      <div className={"header"+(showSideMenu ? "open" : "")}>
        <button onClick={handleToggleSideMenu} className="open-nav-button">
            <i className="fa-solid fa-arrow-left-long"></i>
        </button>
        
        <h1 className="text-gradient">Pokédex</h1>
      </div>
      <input placeholder="E.g 001 or Pikachu" value={searchValue}  onChange={(e) =>setSearchValue(e.target.value)} />
      {filterPokemon.map((pokemon, pokemonIndex) => {
        const filteredPokemonIndex = first151Pokemon.indexOf(pokemon);
        return (
          <button
            className={
               'nav-card' +
              (filteredPokemonIndex === selectedPokemon ? "nav-card-selected" : "")
            }
            key={pokemonIndex}
            onClick={() => {
                setSelectedPokemon(filteredPokemonIndex);
                handleCloseMenu();
            }}
          >
            <p>{getFullPokedexNumber(filteredPokemonIndex)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}
