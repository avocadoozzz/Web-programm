// Функциональность модального окна
document.getElementById('openkart').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('mapModal').style.display = 'block';
    // Инициализация карты при открытии модального окна
    ymaps.ready(init);
  });
  
  document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('mapModal').style.display = 'none';
  });
  
  window.onclick = function(event) {
    if (event.target == document.getElementById('mapModal')) {
      document.getElementById('mapModal').style.display = 'none';
    }
  };
  
  // Инициализация и добавление карты
  function init() {
    const location = [55.751244, 37.618423]; // Пример: координаты Москвы, Россия
    const map = new ymaps.Map('map', {
      center: location,
      zoom: 10,
    });
  
    const placemark = new ymaps.Placemark(location, {
      hintContent: 'Мое местоположение',
      balloonContent: 'Москва, Россия',
    });
  
    map.geoObjects.add(placemark);
  }