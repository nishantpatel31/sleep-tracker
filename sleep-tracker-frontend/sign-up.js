document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const responseEl = document.getElementById("response");

  if (!form) return; // Exit if not on signup page

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nickname = document.getElementById("nickname").value.trim();
    const password = document.getElementById("password").value;
    const identity = ""; // Optional: use session ID later

    if (!nickname || !password) {
      showResponse("Nickname and password are required.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, password, identity }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        showResponse("Invalid server response.", "error");
        return;
      }

      if (res.ok && data.success) {
        showResponse(data.message || "Signup successful!", "success");
        setTimeout(() => {
          window.location.href = "sign-in.html";
        }, 1500);
      } else {
        const errorMsg =
          data?.error?.message ||
          data?.error ||
          data?.message ||
          `Signup failed (code ${res.status})`;
        showResponse(errorMsg, "error");
      }
    } catch (err) {
      showResponse("Network error. Please try again.", "error");
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
