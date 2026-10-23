const spotsList = document.querySelector('#spots-list');
const spotsMessage = document.querySelector('#spots-message');
const spotSelect = document.querySelector('#parking-spot');
const reservationForm = document.querySelector('#reservation-form');
const reservationMessage = document.querySelector('#reservation-message');
const reservationsList = document.querySelector('#reservations-list');
const reservationsMessage = document.querySelector('#reservations-message');

function showLoading() {
  spotsList.replaceChildren();
  spotsMessage.textContent = 'Cargando espacios...';
}

function showError() {
  spotsList.replaceChildren();
  spotSelect.replaceChildren();
  spotsMessage.textContent = 'No se pudieron cargar los espacios.';
  spotsMessage.className = 'error';
}

function renderSpots(spots) {
  spotsList.replaceChildren();
  spotSelect.replaceChildren();

  if (spots.length === 0) {
    spotsMessage.textContent = 'No hay espacios disponibles.';
    return;
  }

  spotsMessage.textContent = '';

  for (const spot of spots) {
    const option = document.createElement('option');
    option.value = spot.id;
    option.textContent = `${spot.number} - Zona ${spot.zone}`;
    spotSelect.append(option);

    const card = document.createElement('article');
    card.className = 'card';

    const title = document.createElement('h3');
    title.textContent = spot.number;

    const details = document.createElement('p');
    details.textContent = `Zona ${spot.zone} - ${spot.type}`;

    const status = document.createElement('p');
    status.textContent = spot.available ? 'Disponible ahora' : 'Ocupado ahora';
    status.className = spot.available ? 'available' : 'unavailable';

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Reservar';
    button.addEventListener('click', () => {
      spotSelect.value = spot.id;
      reservationForm.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('#start-time').focus();
    });

    card.append(title, details, status, button);
    spotsList.append(card);
  }
}

async function loadSpots() {
  const selectedSpot = spotSelect.value;
  showLoading();
  spotsMessage.className = '';

  try {
    const response = await fetch('/api/spots');
    if (!response.ok) {
      throw new Error('Could not load parking spots');
    }

    const spots = await response.json();
    renderSpots(spots);
    if (spots.some((spot) => spot.id === selectedSpot)) {
      spotSelect.value = selectedSpot;
    }
  } catch (error) {
    console.error(error);
    showError();
  }
}

async function createReservation(event) {
  event.preventDefault();
  reservationMessage.textContent = '';
  reservationMessage.className = '';

  const formData = new FormData(reservationForm);
  const parkingSpotId = formData.get('parkingSpotId');
  const startTime = formData.get('startTime');
  const endTime = formData.get('endTime');

  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parkingSpotId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString()
      })
    });

    if (response.status === 409) {
      reservationMessage.textContent = 'Ese espacio ya está reservado en ese horario.';
      reservationMessage.className = 'error';
      return;
    }

    if (!response.ok) {
      throw new Error('Could not create reservation');
    }

    reservationMessage.textContent = 'Reservación creada correctamente.';
    reservationMessage.className = 'success';
    await loadSpots();
    await loadReservations();
  } catch (error) {
    console.error(error);
    reservationMessage.textContent = 'No fue posible crear la reservación.';
    reservationMessage.className = 'error';
  }
}

async function loadReservations() {
  reservationsList.replaceChildren();
  reservationsMessage.textContent = 'Cargando reservaciones...';
  reservationsMessage.className = '';

  try {
    const response = await fetch('/api/reservations');
    if (!response.ok) {
      throw new Error('Could not load reservations');
    }

    const reservations = await response.json();
    reservationsMessage.textContent = reservations.length === 0 ? 'No hay reservaciones.' : '';

    for (const reservation of reservations) {
      const card = document.createElement('article');
      card.className = 'card';

      const title = document.createElement('h3');
      title.textContent = reservation.parkingSpotId?.number ?? 'Espacio eliminado';

      const period = document.createElement('p');
      period.textContent = `${new Date(reservation.startTime).toLocaleString()} – ${new Date(reservation.endTime).toLocaleString()}`;

      const status = document.createElement('p');
      status.textContent = reservation.status === 'ACTIVE' ? 'Activa' : 'Cancelada';

      card.append(title, period, status);

      if (reservation.status === 'ACTIVE') {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'actions';

        const extendButton = document.createElement('button');
        extendButton.type = 'button';
        extendButton.textContent = 'Extender';
        extendButton.addEventListener('click', () =>
          extendReservation(reservation._id, reservation.endTime)
        );

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancelar';
        cancelButton.addEventListener('click', () => cancelReservation(reservation._id));

        actionsContainer.append(extendButton, cancelButton);
        card.append(actionsContainer);
      }

      reservationsList.append(card);
    }
  } catch (error) {
    console.error(error);
    reservationsMessage.textContent = 'No se pudieron cargar las reservaciones.';
    reservationsMessage.className = 'error';
  }
}

async function extendReservation(id, currentEndTime) {
  const currentEndFormatted = new Date(currentEndTime).toISOString().slice(0, 16);
  const newEndTimeInput = prompt(
    'Ingrese la nueva fecha y hora final (YYYY-MM-DDTHH:mm):',
    currentEndFormatted
  );

  if (!newEndTimeInput) {
    return; // Cancelado por el usuario
  }

  try {
    const response = await fetch(`/api/reservations/${id}/extend`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newEndTime: new Date(newEndTimeInput).toISOString()
      })
    });

    const data = await response.json();

    // Verificación de estados de error 4xx / 5xx
    if (!response.ok) {
      reservationsMessage.textContent = data.message || 'No se pudo extender la reservación.';
      reservationsMessage.className = 'error';
      return;
    }

    // Éxito HTTP 200
    reservationsMessage.textContent = 'Reservación extendida correctamente.';
    reservationsMessage.className = 'success';
    await loadReservations();
    await loadSpots();
  } catch (error) {
    console.error(error);
    reservationsMessage.textContent = 'Error al procesar la solicitud de extensión.';
    reservationsMessage.className = 'error';
  }
}

async function cancelReservation(id) {
  try {
    const response = await fetch(`/api/reservations/${id}/cancel`, { method: 'PATCH' });
    if (!response.ok) {
      throw new Error('Could not cancel reservation');
    }

    await loadReservations();
    await loadSpots();
    reservationsMessage.textContent = 'Reservación cancelada correctamente.';
    reservationsMessage.className = 'success';
  } catch (error) {
    console.error(error);
    reservationsMessage.textContent = 'No fue posible cancelar la reservación.';
    reservationsMessage.className = 'error';
  }
}

document.querySelector('#refresh-button').addEventListener('click', loadSpots);
reservationForm.addEventListener('submit', createReservation);
loadSpots();
loadReservations();