import axios from "./axios.js";

export const getAllUsersRequest = async () => {
  //Selecciona todos los usuarios
  const request = await axios.get("/auth/all/users");
  return request.data;
};

export const getUserIdRequest = async (user_ID) => {
  //Selecciona el usuario que coincida con el user_ID enviado por parametro
  const request = await axios.get(`/auth/users/get/${user_ID}`);
  return request.data;
}; //[SE USA] 2

export const putUserIdRequest = async (newData) => {
  //Actualiza un usuario
  const request = await axios.put("/auth/users/update", newData);
  return request.data;
}; //[SE USA]

export const putUserIdPasswordRequest = async (user_ID, newData) => {
  //Actualiza la contraseña de un usuario
  const request = await axios.put(
    `/auth/users/password/update/${user_ID}`,
    newData
  );
  return request.data;
}; //[SE USA]

export const registerUserRequest = async (user) => {
  //Registra un usuario nuevo
  const request = await axios.post("/auth/users/register", user);
  return request.data;
}; //[SE USA]

export const loginUserRequest = async (user) => {
  //Loguea un usuario que coincida con los datos enviados
  const request = await axios.post("/auth/users/login", user);
  return request.data;
}; //[SE USA]

export const logoutUserRequest = async () => {
  //Desloguea un usuario
  const request = await axios.post("/auth/users/logout");
  return request.data;
}; //[SE USA]

export const verifyTokenUserRequest = async () => {
  //Verifica si existe/coincide el UserToken para ingresar a la cuenta del usuario
  const request = await axios.get("/auth/users/verify");
  return request.data;
}; //[SE USA]

export const deleteUserRequest = async (user_ID) => {
  //Elimina un usuario que coincida con el user_ID enviado por parametro
  const request = await axios.delete(`/auth/delete/users/${user_ID}`);
  return request.data;
}; //[SE USA]
