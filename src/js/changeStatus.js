(function () {
  const changeStateButtons = document.querySelectorAll(".change-status");
  const token = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  changeStateButtons.forEach((boton) => {
    boton.addEventListener("click", changeStateProperty);
  });

  async function changeStateProperty(event) {
    const { propertyId: id } = event.target.dataset;

    try {
      const url = `/properties/${id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "CSRF-Token": token,
        },
      });

      const { result } = await response.json();

      if (result) {
        if (event.target.classList.contains("bg-yellow-100")) {
          event.target.classList.add("bg-green-100", "text-green-800");
          event.target.classList.remove("bg-yellow-100", "text-yellow-800");
          event.target.textContent = "Publicado";
        } else {
          event.target.classList.remove("bg-green-100", "text-green-800");
          event.target.classList.add("bg-yellow-100", "text-yellow-800");
          event.target.textContent = "No Publicado";
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
})();
