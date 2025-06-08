document.querySelectorAll('.actividad-btn').forEach(button => {
  const video = button.querySelector('video');
  button.addEventListener('mouseenter', () => video.play());  // Reproduce el video al pasar el mouse
  button.addEventListener('mouseleave', () => video.pause()); // Pausa el video al sacar el mouse
});


