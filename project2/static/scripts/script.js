// Open Add Item Form
function showAddItemForm() {
    document.getElementById('addItemOverlay').style.display = 'flex';
}

// Close Form
function closeForm() {
    document.getElementById('addItemOverlay').style.display = 'none';
}

// Add Rental Item
function addItem() {
    const itemName = document.getElementById('itemName').value.trim();
    const rentedBy = document.getElementById('rentedBy').value.trim();
    const rentalDate = document.getElementById('rentalDate').value;
    const itemPhoto = document.getElementById('itemPhoto').files[0];
    const aadharNumber = document.getElementById('aadharNumber').value.trim();
    const rentPaid = document.getElementById('rentPaid').value.trim();
    
    if (itemName && rentalDate && rentedBy && itemPhoto && aadharNumber && rentPaid) {
        const itemContainer = document.getElementById('itemContainer');

        // Create Item Card
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');
        itemCard.innerHTML = `
            <h3>${itemName}</h3>
            <p>Rented By: ${rentedBy}</p>
            <p>Rent Paid: ₹${rentPaid}</p>
            <p>Rent Date: ${rentalDate}</p>
            <button onclick="deleteItem(event)">Delete</button>
        `;

        // Store details in data attributes
        itemCard.dataset.details = JSON.stringify({
            itemName, rentedBy, rentalDate, aadharNumber, rentPaid,
            itemPhotoUrl: URL.createObjectURL(itemPhoto)
        });

        // Add click event to show details, but exclude the Delete button
        itemCard.addEventListener('click', function(event) {
            if (!event.target.matches('button')) {
                showItemDetails(JSON.parse(this.dataset.details));
            }
        });

        itemContainer.appendChild(itemCard);
        closeForm();
    } else {
        alert('Please enter all details.');
    }
}

// Function to show item details in an overlay
function showItemDetails(details) {
    const overlay = document.getElementById('itemDetailsOverlay');
    overlay.innerHTML = `
        <div class="details-popup">
            
            <h2>${details.itemName}</h2>
            <p><strong>Rented By:</strong> ${details.rentedBy}</p>
            <p><strong>Rental Date:</strong> ${details.rentalDate}</p>
            <p><strong>Aadhar Number:</strong> ${details.aadharNumber}</p>
            <p><strong>Rent Paid:</strong> ₹${details.rentPaid}</p>
            <button onclick="closeDetails()">Close</button>
            <img src="${details.itemPhotoUrl}" alt="${details.itemName}" class="details-photo">
        </div>
    `;
    overlay.style.display = 'flex';
}

// Function to close the details overlay
function closeDetails() {
    document.getElementById('itemDetailsOverlay').style.display = 'none';
}

// Delete Item
function deleteItem(event) {
    event.stopPropagation();  // Prevent triggering card click event
    event.target.parentElement.remove();
}
