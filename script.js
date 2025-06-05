import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDjDOiG3qHJJkZ5KZPaEzVsNJ3_Z8pyZcg",
  authDomain: "foro-virtual-uch.firebaseapp.com",
  projectId: "foro-virtual-uch",
  storageBucket: "foro-virtual-uch.appspot.com",
  messagingSenderId: "699612565782",
  appId: "1:699612565782:web:2f64583d66b75660780037",
  databaseURL: "https://foro-virtual-uch-default-rtdb.firebaseio.com"
};

// Inicializa Firebase y la base de datos
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const postsRef = ref(db, "posts");

// Publicar una nueva idea
document.getElementById("post-btn").addEventListener("click", () => {
  const text = document.getElementById("post-text").value;
  if (text.trim() === "") return;

  push(postsRef, {
    text: text,
    responses: []  // inicializamos con un array vacío
  });

  document.getElementById("post-text").value = "";
});

// Mostrar las publicaciones y sus respuestas
onValue(postsRef, snapshot => {
  const posts = snapshot.val();
  const postList = document.getElementById("post-list");
  postList.innerHTML = "";

  for (const id in posts) {
    const post = posts[id];

    const postDiv = document.createElement("div");
    postDiv.className = "post";

    const p = document.createElement("p");
    p.textContent = post.text;
    postDiv.appendChild(p);

    // Mostrar respuestas (si hay)
    post.responses?.forEach(resp => {
      const resDiv = document.createElement("div");
      resDiv.className = "response";
      resDiv.textContent = resp;
      postDiv.appendChild(resDiv);
    });

    // Input para nueva respuesta
    const input = document.createElement("input");
    input.placeholder = "Responder...";

    const btn = document.createElement("button");
    btn.textContent = "Enviar respuesta";
    btn.onclick = () => {
      const newResp = input.value.trim();
      if (newResp === "") return;

      const newResponses = post.responses || [];
      newResponses.push(newResp);

      update(ref(db, `posts/${id}`), {
        responses: newResponses
      });

      input.value = "";
    };

    postDiv.appendChild(input);
    postDiv.appendChild(btn);
    postList.appendChild(postDiv);
  }
});