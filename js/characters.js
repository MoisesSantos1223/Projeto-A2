export const characters = [
  {
    id: "warrior",
    name: "Guerreiro",
    className: "Combatente",
    image: "imgs/characters/warrior.png",
    fallback: "🛡️",
  },
  {
    id: "mage",
    name: "Mago",
    className: "Arcanista",
    image: "imgs/characters/mage.png",
    fallback: "🧙",
  },
  {
    id: "archer",
    name: "Arqueira",
    className: "Patrulheira",
    image: "imgs/characters/archer.png",
    fallback: "🏹",
  },
  {
    id: "knight",
    name: "Cavaleiro",
    className: "Guardião",
    image: "imgs/characters/knight.png",
    fallback: "⚔️",
  },
  {
    id: "assassin",
    name: "Assassino",
    className: "Sombra",
    image: "imgs/characters/assassin.png",
    fallback: "🥷",
  },
  {
    id: "druid",
    name: "Druida",
    className: "Guardião da natureza",
    image: "imgs/characters/druid.png",
    fallback: "🌿",
  },
  {
    id: "paladin",
    name: "Paladina",
    className: "Protetora",
    image: "imgs/characters/paladin.png",
    fallback: "✨",
  },
  {
    id: "necromancer",
    name: "Necromante",
    className: "Invocador",
    image: "imgs/characters/necromancer.png",
    fallback: "💀",
  },
];

export const getCharacters = (pairCount) => {
  return characters.slice(0, pairCount);
};

export const getImageUrl = (character) => {
  return new URL(`../${character.image}`, import.meta.url).href;
};
