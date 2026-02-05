// seats.js
document.addEventListener('DOMContentLoaded', () => {
  // Optional UI elements (ok if missing)
  const seatInfoEl = document.getElementById('seatInfo');
  const submitBtn  = document.getElementById('submitBtn');

  // Helpers
  const setSeatInfo = (msg, type = 'info') => {
    if (seatInfoEl) {
      seatInfoEl.textContent = msg;
      seatInfoEl.dataset.type = type; // style via [data-type] if you want
    } else {
      console.log(`[SeatInfo/${type}]`, msg);
    }
  };
  const setSubmitEnabled = (enabled) => {
    if (submitBtn) submitBtn.disabled = !enabled;
  };

  async function fetchAvailableSeats(programme, stream) {
    try {
      const url = `/api/seats?programme=${encodeURIComponent(programme)}&stream=${encodeURIComponent(stream)}`;
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) {
        // typical 400 for invalid keys/no seats
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const n = Number(data?.availableSeats);
      return Number.isFinite(n) ? n : 0;
    } catch (e) {
      console.error('[seats.js] fetch /api/seats failed:', e);
      return 0;
    }
  }

  async function updateSeatAvailability(programme, stream) {
    if (!programme) {
      setSeatInfo('Select a programme to view available seats.');
      setSubmitEnabled(false);
      return;
    }
    if (!stream) {
      setSeatInfo('Select a stream to view available seats.');
      setSubmitEnabled(false);
      return;
    }

    const available = await fetchAvailableSeats(programme, stream);
    if (available > 0) {
      setSeatInfo(`Seats available: ${available}`, 'ok');
      setSubmitEnabled(true);
    } else {
      setSeatInfo(`No seats available for ${stream}. Please select another stream.`, 'warn');
      setSubmitEnabled(false);
    }
  }

  // Document-level delegation: handles both #programme and (dynamically created) #stream
  document.addEventListener('change', (e) => {
    const target = e.target;
    if (!target) return;

    // If programme changed, prompt to choose stream (or compute if stream already exists)
    if (target.id === 'programme') {
      const programme = target.value || '';
      const streamEl  = document.getElementById('stream'); // may not exist yet
      const stream    = streamEl?.value || '';
      if (!stream) setSeatInfo('Select a stream to view available seats.');
      updateSeatAvailability(programme, stream);
    }

    // If stream changed, compute with the current programme (which should exist as a select)
    if (target.id === 'stream') {
      const programmeEl = document.getElementById('programme'); // should be static
      const programme   = programmeEl?.value || '';
      const stream      = target.value || '';
      updateSeatAvailability(programme, stream);
    }
  });

  // Initial hint / initial compute if both already present (e.g., browser restores values)
  const programmeInit = document.getElementById('programme')?.value || '';
  const streamInit    = document.getElementById('stream')?.value || '';
  if (programmeInit && streamInit) {
    updateSeatAvailability(programmeInit, streamInit);
  } else {
    setSeatInfo('Select programme and stream to see available seats.');
    setSubmitEnabled(false);
  }
});
