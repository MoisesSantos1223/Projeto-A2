import { characters, getImageUrl } from "../characters.js";

const renderCharacterList = () => {
  const list = document.querySelector("#character-list");
  list.replaceChildren(
    ...characters.map((character) => {
      const entry = document.createElement("article");
      entry.className = "character-entry";
      const image = document.createElement("img");
      image.src = getImageUrl(character);
      image.alt = character.name;
      image.onerror = () => {
        image.remove();
        const fallback = document.createElement("span");
        fallback.className = "fallback";
        fallback.textContent = character.fallback;
        fallback.style.cssText =
          "width:55px;height:55px;display:grid;place-items:center;background:#17130f;font-size:28px";
        entry.prepend(fallback);
      };
      const details = document.createElement("div");
      const name = document.createElement("b");
      name.textContent = character.name;
      const role = document.createElement("small");
      role.textContent = character.className;
      details.append(name, role);
      entry.append(image, details);
      return entry;
    }),
  );
};

renderCharacterList();
