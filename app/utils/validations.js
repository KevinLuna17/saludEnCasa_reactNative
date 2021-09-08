export function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email); //Devuelve false cuando el formato de email es invalido
}

export function validateContrasena(password) {
  const re = /^[a-zA-Z0-9\_\-]{8,12}$/;
  return re.test(password); //Devuelve false cuando el formato de password es invalido
}

export function validatePhone(phone) {
  const re = /^[0-9\_\-]{10}$/;
  return re.test(phone); //Devuelve false cuando el formato de phone es invalido
}
