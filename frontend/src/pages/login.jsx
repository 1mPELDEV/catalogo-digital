import { useState , useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

 useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin");
    }
 }, []);

  async function fazerLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8082/admin/login", {
        email,
        senha,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("slugLoja", res.data.slug);

      window.dispatchEvent(new Event("storage"));

      if (res.data.role === "master") {
        navigate("/master");
      } else {
        navigate("/admin");
      }

      alert("Login feito com sucesso!");
    } catch (err) {
      console.log(err.response?.data);
      alert("Erro no login");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form
        onSubmit={fazerLogin}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center text-slate-800">
          Seu Catalogo - Login
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Insira suas credenciais
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              E-mail
            </label>

            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;