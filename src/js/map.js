(function () {
  const lat = document.querySelector("#lat").value || 6.2445065;
  const lng = document.querySelector("#lng").value || -75.5642444;
  const map = L.map("map").setView([lat, lng], 16);
  let marker;

  // Utilizar Provider y Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // El Pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(map);

  // Detectar el movimiento del pin
  marker.on("moveend", function (e) {
    marker = e.target;
    const position = marker.getLatLng();
    map.panTo(new L.LatLng(position.lat, position.lng));

    // Obtener la información de las calles al soltar el pin
    geocodeService
      .reverse()
      .latlng(position, 16)
      .run(function (error, result) {
        // console.log(result)

        marker.bindPopup(result.address.LongLabel);

        // Llenar los campos
        document.querySelector(".street").textContent =
          result?.address?.Address ?? "";
        document.querySelector("#street").value =
          result?.address?.Address ?? "";
        document.querySelector("#lat").value = result?.latlng?.lat ?? "";
        document.querySelector("#lng").value = result?.latlng?.lng ?? "";
      });
  });
})();
