document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !email) {
      alert('Please complete your name and email before requesting a demo.');
      return;
    }

    alert('Thank you. Our team will contact you shortly to arrange your demo.');
    form.reset();
  });
}
