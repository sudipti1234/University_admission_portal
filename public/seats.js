
// seats.js
// Displays seat availability and toggles submit button

document.addEventListener('DOMContentLoaded', () => {
  const seatInfoEl = document.getElementById('seatInfo');
  const submitBtn = document.getElementById('submitBtn');

  const setSeatInfo = (msg, type='info') => {
    if (seatInfoEl) { seatInfoEl.textContent = msg; seatInfoEl.dataset.type = type; }
    else { console.log(`[SeatInfo/${type}]`, msg); }
  };
  const setSubmitEnabled = (enabled) => { if (submitBtn) submitBtn.disabled = !enabled; };

  async function fetchAvailableSeats(programme, stream) {
    try {
      const url = `/api/seats?programme=${encodeURIComponent(programme)}&stream=${encodeURIComponent(stream)}`;
      const res = await fetch(url);
      if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err?.message || `HTTP ${res.status}`); }
      const data = await res.json();
      const n = Number(data?.availableSeats); return Number.isFinite(n) ? n : 0;
    } catch(e) { console.error('[seats.js] fetch /api/seats failed:', e); return 0; }
  }

  async function updateSeatAvailability(programme, stream){
    if (!programme){ setSeatInfo('Select a programme to view available seats.'); setSubmitEnabled(false); return; }
    if (!stream){ setSeatInfo('Select a stream to view available seats.'); setSubmitEnabled(false); return; }
    const available = await fetchAvailableSeats(programme, stream);
    if (available > 0){ setSeatInfo(`Seats available: ${available}`, 'ok'); setSubmitEnabled(true); }
    else { setSeatInfo(`No seats available for ${stream}. Please select another stream.`, 'warn'); setSubmitEnabled(false); }
  }

  document.addEventListener('change', (e) => {
    const t = e.target; if (!t) return;
    if (t.id === 'programme'){
      const programme = t.value || '';
      const stream = document.getElementById('stream')?.value || '';
      if (!stream) setSeatInfo('Select a stream to view available seats.');
      updateSeatAvailability(programme, stream);
    }
    if (t.id === 'stream'){
      const programme = document.getElementById('programme')?.value || '';
      const stream = t.value || '';
      updateSeatAvailability(programme, stream);
    }
  });

  const programmeInit = document.getElementById('programme')?.value || '';
  const streamInit = document.getElementById('stream')?.value || '';
  if (programmeInit && streamInit) updateSeatAvailability(programmeInit, streamInit);
  else { setSeatInfo('Select programme and stream to see available seats.'); setSubmitEnabled(false); }
});
