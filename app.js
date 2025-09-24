document.addEventListener("DOMContentLoaded", () => {
    const movieForm = document.getElementById("movieForm");
    const movieTableBody = document.getElementById("movie-table-body");
    const heroButton = document.querySelector("header a.btn");

    function renderStars(rating) {
        let stars = "";
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? "★" : "☆";
        }
        return stars;
    }

    function showEmptyMessage() {
        const row = document.createElement("tr");
        row.id = "empty-message";
        row.innerHTML = `
            <td colspan="6" class="text-center text-muted">
                Aún no has agregado ninguna película.
            </td>
        `;
        movieTableBody.appendChild(row);
    }

    function removeEmptyMessage() {
        const emptyRow = document.getElementById("empty-message");
        if (emptyRow) {
            emptyRow.remove();
        }
    }

    function updateHeroButton() {
        if (movieTableBody.children.length === 0 || document.getElementById("empty-message")) {
            heroButton.textContent = "Agrega tu primera película";
            heroButton.href = "#add-movie";
        } else {
            heroButton.textContent = "Ver mis reseñas";
            heroButton.href = "#movie-list";
        }
    }

    showEmptyMessage();
    updateHeroButton();

    movieForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("movie-name").value;
        const imageInput = document.getElementById("movie-image");
        const year = document.getElementById("release-year").value;
        const genre = document.getElementById("genre").value;
        const review = document.getElementById("movie-review").value;
        const rating = parseInt(document.getElementById("rating").value);

        let imageURL = "";
        if (imageInput.files && imageInput.files[0]) {
            imageURL = URL.createObjectURL(imageInput.files[0]);
        }

        removeEmptyMessage();

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${name}</td>
            <td><img src="${imageURL}" alt="${name}" width="80" class="img-thumbnail"></td>
            <td>${year}</td>
            <td>${genre}</td>
            <td>${review}</td>
            <td>${renderStars(rating)}</td>
        `;

        movieTableBody.appendChild(row);

        movieForm.reset();

        updateHeroButton();
    });
});
