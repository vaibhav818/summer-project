// Train Reservation System using Queue Data Structure

// Constants
const TOTAL_SEATS = 5; // Total seats available in the train
const SEATS_PER_ROW = 10; // Seats per row in the display

// Data Structures
let availableSeats = []; // Array to track available seats
let bookedSeats = []; // Array to track booked seats
let waitlistQueue = []; // Queue for waitlisted passengers

// DOM Elements
const seatsContainer = document.getElementById('seatsContainer');
const reservationForm = document.getElementById('reservationForm');
const reservationsTable = document.getElementById('reservationsTable').querySelector('tbody');
const waitlistTable = document.getElementById('waitlistTable').querySelector('tbody');

// Initialize the application
function init() {
    // Create all seats as available initially
    for (let i = 1; i <= TOTAL_SEATS; i++) {
        availableSeats.push(i);
    }
    
    // Generate seat map
    renderSeatMap();
    
    // Set up form submission handler
    reservationForm.addEventListener('submit', handleReservation);
}

// Render the visual seat map
function renderSeatMap() {
    seatsContainer.innerHTML = ''; // Clear existing seats
    
    // Create each seat element
    for (let i = 1; i <= TOTAL_SEATS; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.textContent = i;
        seat.dataset.seatNumber = i;
        
        // Mark as booked if already reserved
        if (bookedSeats.includes(i)) {
            seat.classList.add('booked');
        }
        
        // Add click handler for seat selection
        seat.addEventListener('click', () => toggleSeatSelection(seat));
        seatsContainer.appendChild(seat);
    }
}

// Handle seat selection/deselection
function toggleSeatSelection(seatElement) {
    const seatNumber = parseInt(seatElement.dataset.seatNumber);
    
    // Don't allow selection of booked seats
    if (seatElement.classList.contains('booked')) return;
    
    // Toggle selection
    if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
    } else {
        seatElement.classList.add('selected');
    }
}

// Handle form submission for new reservations
function handleReservation(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('passengerName').value;
    const age = document.getElementById('passengerAge').value;
    const preference = document.getElementById('seatPreference').value;
    
    // Find selected seats
    const selectedSeats = Array.from(document.querySelectorAll('.seat.selected'))
        .map(seat => parseInt(seat.dataset.seatNumber));
    
    // Check if any seats are selected
    if (selectedSeats.length > 0) {
        // Book all selected seats
        selectedSeats.forEach(seatNumber => {
            bookSeat(seatNumber, name, age);
        });
    } else {
        // Auto-assign seat based on preference
        const seatNumber = findAvailableSeat(preference);
        
        if (seatNumber) {
            bookSeat(seatNumber, name, age);
        } else {
            // No seats available, add to waitlist queue
            addToWaitlist(name, age);
        }
    }
    
    // Reset form
    reservationForm.reset();
    renderAllData();
}

// Book a specific seat
function bookSeat(seatNumber, passengerName, passengerAge) {
    // Remove from available seats
    availableSeats = availableSeats.filter(seat => seat !== seatNumber);
    
    // Add to booked seats
    if (!bookedSeats.includes(seatNumber)) {
        bookedSeats.push(seatNumber);
    }
    
    // Add to reservations table
    addReservationToTable(seatNumber, passengerName, passengerAge, 'Confirmed');
    
    // Update seat map
    renderSeatMap();
}

// Find an available seat based on preference
function findAvailableSeat(preference) {
    if (availableSeats.length === 0) return null;
    
    // Simple preference logic - window seats are 1-5 and 46-50 in each row
    if (preference === 'window') {
        const windowSeats = availableSeats.filter(seat => {
            const positionInRow = (seat - 1) % SEATS_PER_ROW;
            return positionInRow < 5 || positionInRow >= 8;
        });
        return windowSeats.length > 0 ? windowSeats[0] : availableSeats[0];
    } 
    // Aisle seats are 6-7 in each row
    else if (preference === 'aisle') {
        const aisleSeats = availableSeats.filter(seat => {
            const positionInRow = (seat - 1) % SEATS_PER_ROW;
            return positionInRow >= 5 && positionInRow < 8;
        });
        return aisleSeats.length > 0 ? aisleSeats[0] : availableSeats[0];
    }
    
    // No preference or no matching seats - return first available
    return availableSeats[0];
}

// Add passenger to waitlist queue
function addToWaitlist(passengerName, passengerAge) {
    // Add to the end of the queue
    waitlistQueue.push({ name: passengerName, age: passengerAge });
    
    // Update waitlist table
    renderWaitlistTable();
}

// Process waitlist when seats become available
function processWaitlist() {
    if (availableSeats.length > 0 && waitlistQueue.length > 0) {
        // Get first passenger from queue
        const passenger = waitlistQueue.shift();
        
        // Book seat for them
        const seatNumber = availableSeats.shift();
        bookedSeats.push(seatNumber);
        
        // Add to reservations
        addReservationToTable(seatNumber, passenger.name, passenger.age, 'From Waitlist');
        
        // Update displays
        renderSeatMap();
        renderWaitlistTable();
    }
}

// Add a reservation to the table
function addReservationToTable(seatNumber, name, age, status) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${seatNumber}</td>
        <td>${name}</td>
        <td>${age}</td>
        <td>${status}</td>
    `;
    
    reservationsTable.appendChild(row);
}

// Render the waitlist table
function renderWaitlistTable() {
    waitlistTable.innerHTML = '';
    
    waitlistQueue.forEach((passenger, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${passenger.name}</td>
            <td>${passenger.age}</td>
        `;
        
        waitlistTable.appendChild(row);
    });
}

// Update all data displays
function renderAllData() {
    renderSeatMap();
    renderWaitlistTable();
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', init);