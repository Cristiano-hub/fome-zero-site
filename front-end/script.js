document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formFeedback");
  const mural = document.getElementById("mural");

  // Conexão com Supabase
  const supabaseUrl = "https://ikcuuzesfvotxnlpbnau.supabase.co";
  const supabaseKey = "sb_publishable_aEWxMGfN8jj6b1eUyghU5Q_-P7cfwf5"; // chave pública
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

  // Função para carregar feedbacks
  async function carregarFeedbacks() {
    const { data, error } = await supabaseClient
      .from("feedbacks")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao carregar feedbacks:", error);
      mural.innerHTML += "<p>Não foi possível carregar os depoimentos.</p>";
      return;
    }

    mural.innerHTML = "<h3>Depoimentos da Comunidade</h3>";
    data.forEach(fb => {
      const depoimento = document.createElement("div");
      depoimento.classList.add("depoimento");
      depoimento.innerHTML = `
        <p class="autor">${fb.nome}</p>
        <p class="data">${new Date(fb.dataHora).toLocaleString("pt-BR")}</p>
        <p class="comentario">${fb.mensagem}</p>
      `;
      mural.appendChild(depoimento);
    });
  }

  // Função para enviar feedback
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !mensagem) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const { error } = await supabaseClient
      .from("feedbacks")
      .insert([{ nome, mensagem }]); // dataHora preenchido automaticamente no Supabase

    if (error) {
      console.error("Erro ao enviar feedback:", error);
      alert("Não foi possível enviar seu feedback.");
    } else {
      form.reset();
      carregarFeedbacks();
    }
  });

  // Carregar feedbacks ao abrir a página
  carregarFeedbacks();
});
