import bcrypt from "bcrypt";

const users = [
  {
    name: "Bladimir Parra",
    email: "correo@correo.com",
    confirmed: 1,
    password: bcrypt.hashSync("password", 10),
  },
];

export default users;
