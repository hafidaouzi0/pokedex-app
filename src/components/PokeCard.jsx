import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard(props) {
  //destructuring props
  const { selectedPokemon, setSelectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) return false;
    if (["versions", "other"].includes(val)) return false;
    return true;
  });

  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);
  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) return;

    //check cache for move
    let cache = {};
    if (localStorage.getItem("pokemon-moves")) {
      cache = JSON.parse(localStorage.getItem("pokemon-moves"));
    }

    if (move in cache) {
      setSkill(cache[move]);
      console.log("Found move in cache");
      return;
    }
    try {
      setLoadingSkill(true);
      const response = await fetch(moveUrl);
      const moveData = await response.json();
      console.log("Fetched move data from api", moveData);
      const description = moveData.flavor_text_entries.filter(
        (val) => val.version_group.name === "firered-leafgreen"
      )[0]?.flavor_text;
      const skillData = {
        name: moveData.name,
        description,
      };
      setSkill(skillData);
      cache[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(cache));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    //if loading exit logic
    if (loading || !localStorage) {
      return;
    }
    //check if the slected pokemon information is available in the cache
    //1.define the cache
    let cache = {};
    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }
    //2.check if the selected pokemin is in the cache , otherwise fetch from the api
    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon]);
      console.log("Found pokemon in cache");
      return;
    }
    //3. if we fetch from the pai make sure to save teh information in the cache for next time
    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = `pokemon/` + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;
        const response = await fetch(finalUrl);
        const pokemonData = await response.json();
        setData(pokemonData);
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
        console.log("Fetched pokemon data from api");
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPokemonData();
  }, [selectedPokemon]); //dependency array
  //whenever new pokemon slected we need to refetch

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }
  return (
    <div className="poke-card">
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill?.name.replaceAll("-", " ")}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill?.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
        <div className="type-container">
          {types.map((typeObj, typeIndex) => {
            return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
          })}
        </div>
        <img
          className="default-img"
          src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
          alt={`${name}-large-img`}
        />
        <div className="img-container">
          {imgList.map((spriteUrl, spriteIndex) => {
            const imgUrl = sprites[spriteUrl];

            return (
              <img
                key={spriteIndex}
                src={imgUrl}
                alt={`${name}-img-${spriteUrl}`}
              />
            );
          })}
        </div>
        <h3>Stats</h3>
        <div className="stats-card">
          {stats.map((statObj, statIndex) => {
            const { stat, base_stat } = statObj;
            return (
              <div key={statIndex} className="stat-item">
                <p>{stat?.name.replaceAll("-", " ")}</p>
                <p>{base_stat}</p>
              </div>
            );
          })}
        </div>
        <h3>Moves</h3>
        <div className="pokemon-move-grid">
          {moves.map((moveObj, moveIndex) => {
            const { move } = moveObj;
            return (
              <button key={moveIndex} onClick={() => {fetchMoveData(move?.name.replaceAll("-", " "), move?.url)}}>
                <p>{move?.name}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
