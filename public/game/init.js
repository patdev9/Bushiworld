(async function ()  {
  if (typeof window !== "undefined") {
  const overworld = await new Overworld({
    element: document.querySelector(".game-container")
  });
  overworld.init();
  }
})();