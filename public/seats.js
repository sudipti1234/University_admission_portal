// seats.js
document.addEventListener('DOMContentLoaded', () => {
  // Static element present on the page
  const programmeEl = document.getElementById('programme');

  // Optional UI hooks (if missing, we degrade gracefully)
  const seatInfoEl  = document.getElementById('seatInfo');
  const submitBtn   = document.getElementById('submitBtn');

  // If #programme isn't on this page, skip to avoid "addEventListener on null"
  if (!programmeEl) {
    console.warn('[seats.js] #programme not found; skipping seat availability logic.');
    return;
  }

  // Helpers for UI
  const setSeatInfo = (msg) => {
    if (seatInfoEl) seatInfoEl.textContent = msg;
    else            console.log('[SeatInfo]', msg);
  };

  const setSubmitEnabled = (enabled) => {
    if (submitBtn) submitBtn.disabled = !enabled;
  };

  // Call backend for availability
  async function fetchAvailableSeats(programme, stream) {
    try {
      // NOTE: proper '&' and encoded values; no 'localhost' → relative path hits the same host (AKS LB)
      const url = `/api/seats?programme=${encodeURIComponent(programme)}&stream=${encodeURIComponent(stream)}`;
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) {
        // 400 is expected for invalid keys / no seats; surface message if present
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const n = Number(data?.availableSeats);
      return Number.isFinite(n) ? n : 0;
    } catch (e) {
      console.error('[seats.js] Error fetching seat availability:', e);
      return 0;
    }
  }

  // Update UI based on availability (guard against missing selections)
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
      setSeatInfo(`Seats available: ${available}`);
      setSubmitEnabled(true);
    } else {
      setSeatInfo(`No seats available for ${stream}. Please select another stream.`);
      setSubmitEnabled(false);
    }
  }

  // When programme changes:
  // - your other script renders #stream dynamically
  // - we still attempt an update (will prompt to pick a stream if none)
  programmeEl.addEventListener('change', () => {
    const streamEl = document.getElementById('stream'); // might not exist yet
    updateSeatAvailability(programmeEl.value, streamEl?.value || '');
  });

  // Because #stream is created dynamically, use event delegation:
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'stream') {
      const currentProgramme = programmeEl.value || '';
      const currentStream    = e.target.value || '';
      updateSeatAvailability(currentProgramme, currentStream);
    }
  });

  // If both were pre-filled (e.g., browser restore), compute once on load
  const initialStream = document.getElementById('stream')?.value || '';
  if (programmeEl.value && initialStream) {
    updateSeatAvailability(programmeEl.value, initialStream);
  } else {
    // Friendly hint at startup
    setSeatInfo('Select programme and stream to see available seats.');
    setSubmitEnabled(false);
  }
});
