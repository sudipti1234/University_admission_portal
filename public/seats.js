// Fetch the available seats from the server
async function fetchAvailableSeats(programme, stream) {
    try {
        const response = await fetch(`/api/seats?programme=${programme}&stream=${stream}`);
        const data = await response.json();
        return data.availableSeats;
    } catch (error) {
        console.error('Error fetching seat availability:', error);
        return 0; // Return 0 if there's an error
    }
}

// Update the seat availability display
function updateSeatAvailability(programme, stream) {
    fetchAvailableSeats(programme, stream)
        .then(availableSeats => {
            const seatInfo = document.getElementById('seatInfo');
            if (availableSeats > 0) {
                seatInfo.textContent = `Seats available: ${availableSeats}`;
                document.getElementById('submitBtn').disabled = false; // Enable form submission
            } else {
                seatInfo.textContent = `No seats available for ${stream}. Please select another stream.`;
                document.getElementById('submitBtn').disabled = true; // Disable form submission
            }
        });
}

// Listen for changes in programme and stream selection
document.getElementById('programme').addEventListener('change', function() {
    const programme = this.value;
    const stream = document.getElementById('stream').value;
    if (programme && stream) {
        updateSeatAvailability(programme, stream);
    }
});

document.getElementById('stream').addEventListener('change', function() {
    const programme = document.getElementById('programme').value;
    const stream = this.value;
    if (programme && stream) {
        updateSeatAvailability(programme, stream);
    }
});
