const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
document.getElementById('current-date').textContent = formattedDate;

function toggleDescription(button) {
  const desc = button.closest('li').querySelector('.description');
  if (desc) {
    desc.classList.toggle('hidden');
    if (desc.classList.contains('hidden')) {
      button.textContent = "Details";
    } else {
      button.textContent = "Hide details";
    }
  }
}