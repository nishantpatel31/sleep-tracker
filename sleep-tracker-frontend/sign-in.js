document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const responseEl = document.getElementById("response");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nickname = document.getElementById("nickname").value.trim();
    const password = document.getElementById("password").value;

    if (!nickname || !password) {
      showResponse("Nickname and password are required.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        showResponse("Invalid server response.", "error");
        return;
      }

      if (res.ok && data.success) {
        showResponse(data.message || "Login successful!", "success");

        if (data.token && data.nickname) {
          localStorage.setItem("jwtToken", data.token);
          localStorage.setItem("nickname", data.nickname);

          setTimeout(() => {
            window.location.href = "index.html";
          }, 1200);
        } else {
          showResponse("Missing login data. Try again.", "error");
        }
      } else {
        const errorMsg =
          data?.error?.message ||
          data?.error ||
          data?.message ||
          `Login failed (code ${res.status}).`;
        showResponse(errorMsg, "error");
      }
    } catch (err) {
      showResponse("Network error. Please check your connection.", "error");
    }
  });

  function showResponse(message, type = "info") {
    responseEl.textContent = message;
    responseEl.className = `status-${type}`;

    setTimeout(() => {
      responseEl.textContent = "";
      responseEl.className = "";
    }, 3000);
  }
});
