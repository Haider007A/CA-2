document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  function handleCellClick(event) {
    const cell = event.target;
    const x = cell.dataset.x;
    const y = cell.dataset.y;
    placeMonster(x, y);
  }

  function placeMonster(x, y) {
    // AJAX request to server to place monster
    fetch("/place-monster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ x, y }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to place monster");
        }
      })
      .then((data) => {
        console.log("Monster placed successfully:", data);
      })
      .catch((error) => {
        console.error("Error placing monster:", error);
      });
  }
});
