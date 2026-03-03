const greet = () => {
  let input = document.querySelector('input').value;
  let heading = document.querySelector('h1').innerText = `Hello ${input}`;
};

let boxes = document.querySelectorAll('.boxes'); // ← also missing the dot

boxes.forEach((box, index) => {
  box.addEventListener('click', () => {
    if (index === 0) {
      box.classList.add('red');
    } else if (index === 1) {
       box.classList.add('blue');
    } else if (index === 2) {
       box.classList.add('green');
    } else if (index === 3) {
       box.classList.add('yellow');
    }        
  });        
});          