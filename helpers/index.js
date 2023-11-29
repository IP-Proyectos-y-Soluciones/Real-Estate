const enSeller = (userId, propertyUserId) => {
  return userId === propertyUserId;
};

const formatDate = (d) => {
  const newDate = new Date(d).toISOString().slice(0, 10);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(newDate).toLocaleDateString("es-ES", options);
};

export { enSeller, formatDate };
