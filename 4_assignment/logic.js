// ── EmailJS Config ──────────────────────────────
const EMAILJS_PUBLIC_KEY  = 'qaYt9R1sJNxmaiAMv';
const EMAILJS_SERVICE_ID  = 'service_nyaf0zq';
const EMAILJS_TEMPLATE_ID = 'template_1x3izw5';

emailjs.init(EMAILJS_PUBLIC_KEY);

// ── Cart ─────────────────────────────────────────
let cart = [];

function toggleCart(btn) {
  const service = btn.closest('.service');
  const name    = service.dataset.name;
  const price   = parseFloat(service.dataset.price);
  const inCart  = cart.find(i => i.name === name);

  if (inCart) {
    cart = cart.filter(i => i.name !== name);
    btn.textContent = 'Add Item ⊕';
    btn.className   = 'btn-add';
  } else {
    cart.push({ name, price });
    btn.textContent = 'Remove Item ⊖';
    btn.className   = 'btn-remove';
  }

  renderCart();
}

function renderCart() {
  const tbody = document.getElementById('cart-body');
  tbody.innerHTML = '';
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.name}</td>
      <td>₹${item.price.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('total-display').textContent = `₹${total.toFixed(2)}`;
}

// ── Booking ──────────────────────────────────────
function handleBooking() {
  const name  = document.getElementById('fullName').value.trim();
  const email = document.getElementById('emailId').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();
  const msg   = document.getElementById('booking-msg');
  const btn   = document.querySelector('.btn-book');

  if (!name || !email || !phone) {
    showMsg(msg, '⚠️ Please fill in all fields before booking.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showMsg(msg, '⚠️ Please enter a valid email address.', 'error');
    return;
  }
  if (cart.length === 0) {
    showMsg(msg, '⚠️ Your cart is empty. Add at least one service.', 'error');
    return;
  }

  const itemLines = cart
    .map((item, i) => `${i + 1}. ${item.name} — ₹${item.price.toFixed(2)}`)
    .join('\n');

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  const templateParams = {
    to_name  : name,
    to_email : email,
    phone    : phone,
    items    : itemLines,
    total    : `₹${total.toFixed(2)}`,
  };

  btn.disabled    = true;
  btn.textContent = 'Sending…';

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      showMsg(msg, `Thank you For
      Booking the Service We will get back to you soon!`, 'success');
      showToast(`Confirmation sent to ${email} 🎉`);
      resetForm();
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      showMsg(msg, '❌ Could not send email. Please try again.', 'error');
    })
    .finally(() => {
      btn.disabled    = false;
      btn.textContent = 'Book now';
    });
}

function resetForm() {
  document.getElementById('fullName').value    = '';
  document.getElementById('emailId').value     = '';
  document.getElementById('phoneNumber').value = '';
  cart = [];
  renderCart();
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.textContent = 'Add Item ⊕';
    btn.className   = 'btn-add';
  });
}

// ── Newsletter ───────────────────────────────────
function handleSubscribe() {
  const name  = document.getElementById('sub-name').value.trim();
  const email = document.getElementById('sub-email').value.trim();

  if (!name || !email) {
    showToast('⚠️ Please enter your name and email.');
    return;
  }
  if (!isValidEmail(email)) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }

  document.getElementById('sub-name').value  = '';
  document.getElementById('sub-email').value = '';
  showToast(`✅ Thanks ${name}! You're subscribed.`);
}

// ── Helpers ──────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMsg(el, text, type) {
  el.textContent = text;
  el.className   = `booking-msg ${type}`;
  setTimeout(() => { el.textContent = ''; el.className = 'booking-msg'; }, 5000);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
