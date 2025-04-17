// Password toggle functionality
document.getElementById('toggle-password').addEventListener('click', function() {
    const pwdInput = document.getElementById('account_password');
    const pwdBtn = document.getElementById('toggle-password');
    
    if (pwdInput.getAttribute("type") === "password") {
      pwdInput.setAttribute("type", "text");
      pwdBtn.innerText = "Hide Password";
    } else {
      pwdInput.setAttribute("type", "password");
      pwdBtn.innerText = "Show Password";
    }
  });