// ✅ Vérifie si l'utilisateur est authentifié
export const isAuthenticated = () => {
  const token = sessionStorage.getItem("token");
  return token !== null && token !== "undefined";
};

// ✅ Vérifie si l'utilisateur est un admin
export const isAdmin = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user).role === "admin" : false;
};

// ✅ Sauvegarde l'utilisateur dans la session (avec l'ObjectId MongoDB)
export const saveUserSession = (token, user) => {
  const userSession = {
    id: user.id || user._id, // 🔥 C'EST LA CORRECTION IMPORTANTE 🔥
    name: user.name,
    email: user.email,
    role: user.role,
  };
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(userSession));

  console.log("✅ Session stockée :", userSession);
};

// ✅ Déconnexion : Supprime la session et redirige
export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.location.href = "/login";
};
