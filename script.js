let loggedIn = false;


// Open login modal
document.getElementById('login-btn').addEventListener('click', function() {
    document.getElementById('login-modal').style.display = 'flex';
});


// Close login modal
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('login-modal').style.display = 'none';
});


// Open registration modal when "Create Account" is clicked
document.getElementById('create-account-btn').addEventListener('click', function() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('register-modal').style.display = 'flex';
});


// Close registration modal
document.getElementById('close-register-modal').addEventListener('click', function() {
    document.getElementById('register-modal').style.display = 'none';
});


// Handle login form submission
function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            loggedIn = true;
            localStorage.setItem('userId', data.userId); // Save userId in localStorage
            alert(data.message);
            document.getElementById('login-modal').style.display = 'none';
            document.querySelector('.services').style.display = 'block'; // Show services
        } else {
            alert('Invalid credentials');
        }
    });
}


// Register new user
// function registerUser() {
//     const username = document.getElementById('new-username').value;
//     const password = document.getElementById('new-password').value;


//     fetch('http://localhost:3000/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.message === 'Registration successful') {
//             alert(data.message);
//             document.getElementById('register-modal').style.display = 'none';
//             document.getElementById('login-modal').style.display = 'flex'; // Show login modal after successful registration
//         } else {
//             alert('Registration failed. Try again.');
//         }
//     });
// }
function registerUser() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'User registered successfully') {
            alert(data.message);
            document.getElementById('register-modal').style.display = 'none';
            document.getElementById('login-modal').style.display = 'flex'; // Show login modal after successful registration
        } else {
            alert('Registration failed. Try again.');
        }
    })
    .catch(error => {
        console.error('Error during registration:', error);
        alert('Registration failed. Please check your network connection and try again.');
    });
}

function toggleTable() {
    const tableSection = document.getElementById("table-section");
    const readMoreBtn = document.getElementById("read-more-btn");

    if (tableSection.style.display === "none" || tableSection.style.display === "") {
        tableSection.style.display = "block"; // Show the table
        readMoreBtn.textContent = "Show Less"; // Change button text
        tableSection.scrollIntoView({ behavior: "smooth" }); // Scroll to the table
    } else {
        tableSection.style.display = "none"; // Hide the table
        readMoreBtn.textContent = "Read More"; // Reset button text
    }
}

// Check login status before allowing service selection
function checkLogin() {
    if (!loggedIn) {
        alert('Please log in first!');
    } else {
        document.querySelector('.services').style.display = 'block';
    }
}


// Schedule pickup only if logged in
function schedulePickup(serviceType) {
    if (loggedIn) {
        document.querySelector('.schedule').style.display = 'block';
        document.querySelector('.services').style.display = 'none'; // Hide services
        // Store selected service type for later use
        localStorage.setItem('serviceType', serviceType);
    } else {
        alert('Please log in first!');
    }
}


// Submit pickup request
function submitPickup() {
    const serviceType = localStorage.getItem('serviceType');
    const pickupDate = document.getElementById('pickup-date').value;
    const pickupLocation = document.getElementById('pickup-location').value;
    const userId = localStorage.getItem('userId');


    fetch('http://localhost:3000/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, serviceType, pickupDate, pickupLocation })
    })
    .then(response => response.json())
    .then(data => alert(data.message));
}

let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.getElementsByClassName("mySlides");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  // Hide all slides
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}  // Reset to first slide if it's the last one
  slides[slideIndex - 1].style.display = "block";  // Display the current slide
  setTimeout(showSlides, 4000); // Change image every 4 seconds
}

let currentIndex = 0;
const slides = document.querySelectorAll('.mySlides');

function showNextSlide() {
  slides[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % slides.length;
  slides[currentIndex].classList.add('active');
}

// Show first image by default
slides[currentIndex].classList.add('active');

// Change image every 3 seconds
setInterval(showNextSlide, 3000);
