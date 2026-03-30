// script.js for Gallery App

document.addEventListener('DOMContentLoaded', function() {
    loadGallery();

    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', handleUpload);

    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

async function handleUpload(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const statusDiv = document.getElementById('uploadStatus');

    statusDiv.innerHTML = '<p class="text-blue-600">Uploading...</p>';

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            statusDiv.innerHTML = '<p class="text-green-600">Upload successful!</p>';
            loadGallery(); // Reload gallery
            e.target.reset(); // Reset form
        } else {
            statusDiv.innerHTML = `<p class="text-red-600">Upload failed: ${result.message}</p>`;
        }
    } catch (error) {
        statusDiv.innerHTML = '<p class="text-red-600">Upload failed: Network error</p>';
    }
}

async function loadGallery() {
    const galleryDiv = document.getElementById('gallery');

    try {
        const response = await fetch('/api/photos');
        const result = await response.json();

        if (result.status === 'success') {
            galleryDiv.innerHTML = '';
            result.data.forEach(filename => {
                const imgDiv = document.createElement('div');
                imgDiv.className = 'relative group cursor-pointer';
                imgDiv.innerHTML = `
                    <img src="/images/${filename}" alt="${filename}" class="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" onclick="openModal('/images/${filename}')">
                    <div class="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <button class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-600 hover:bg-red-700 px-3 py-1 rounded" onclick="deleteImage('${filename}')">Delete</button>
                    </div>
                `;
                galleryDiv.appendChild(imgDiv);
            });
        } else {
            galleryDiv.innerHTML = '<p class="text-gray-500">No images found.</p>';
        }
    } catch (error) {
        galleryDiv.innerHTML = '<p class="text-red-600">Failed to load gallery.</p>';
    }
}

function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = src;
    modal.classList.remove('hidden');
}

async function deleteImage(filename) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
        const response = await fetch(`/api/delete/${filename}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.status === 'success') {
            loadGallery(); // Reload gallery
        } else {
            alert('Delete failed: ' + result.message);
        }
    } catch (error) {
        alert('Delete failed: Network error');
    }
}
