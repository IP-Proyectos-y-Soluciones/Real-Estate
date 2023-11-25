import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  const transpot = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  // Enviar el email
  await transpot.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confirma tu Cuenta en BienesRaices.com",
    text: "Confirma tu Cuenta en BienesRaices.com",
    html: `
      <p>Hola ${name}, comprueba tu cuenta en bienesRaices.com</p>

      <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: 
        <a href="${ process.env.BACKEND_URL }:${ process.env.PORT ?? 3000 }/auth/confirm/${ token }">Confirmar Cuenta</a> 
      </p>

      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `,
  });
};

const emailForgetPassword = async ( data ) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  // Enviar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Reestablece tu Password en BienesRaices.com",
    text: "Reestablece tu Password en BienesRaices.com",
    html: `
      <p>Hola ${ name }, has solicitado reestablecer tu password en bienesRaices.com</p>

      <p>Sigue el siguiente enlace para generar un password nuevo: 
        <a href="${ process.env.BACKEND_URL }:${ process.env.PORT ?? 3000 }/auth/forget-password/${ token }">Reestablecer Password</a> 
      </p>

      <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
    `,
  });
}

export {
  emailRegister,
  emailForgetPassword
}