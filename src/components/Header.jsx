export default function Header(props) {
    const { handleToggleSideMenu} = props

  return (
    <header>
      <button onClick={handleToggleSideMenu} className="open-nav-button">
        <i className="fa-solid fa-bars"></i>
      </button>
      <h1 className="text-gradient">Pokedéx</h1>
    </header>
  );
}
