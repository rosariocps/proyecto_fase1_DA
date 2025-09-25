document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("movieForm");
    const movieCards = document.getElementById("movie-cards");

    const editModalEl = document.getElementById("editModal");
    const editModal = new bootstrap.Modal(editModalEl);
    const editForm = document.getElementById("editForm");

    const $e = (id) => document.getElementById(id);
    const eTitle = $e("edit-movie-title");
    const eDirector = $e("edit-director");
    const eDate = $e("edit-release-date");
    const eGenre = $e("edit-genre");
    const eSynopsis = $e("edit-synopsis");
    const eReview = $e("edit-review");
    const eFav = $e("edit-fav-quote");
    const eRating = $e("edit-rating");
    const eImage = $e("edit-movie-image");

    let currentEditCard = null;

    const ctxRatings = document.getElementById("ratingsChart").getContext("2d");
    const ctxGenres = document.getElementById("genreChart").getContext("2d");

    let ratingCounts = [0, 0, 0, 0, 0]; 
    let genreCounts = {};

    const ratingsChart = new Chart(ctxRatings, {
        type: "bar",
        data: {
            labels: ["1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas"],
            datasets: [{
                label: "Cantidad de películas",
                data: ratingCounts,
                backgroundColor: ["#b20710", "#e50914", "#f5c518", "#4caf50", "#2196f3"],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, precision: 0 } }
        }
    });

    const genreChart = new Chart(ctxGenres, {
        type: "pie",
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    "#e50914", "#f5c518", "#4caf50", "#2196f3", "#9c27b0",
                    "#ff9800", "#00bcd4", "#795548", "#8bc34a", "#ff5722"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });

    function updateRatingsChart() {
        ratingCounts = [0, 0, 0, 0, 0];
        document.querySelectorAll(".movie-card").forEach(card => {
            const rating = parseInt(card.dataset.rating || "0", 10);
            if (rating >= 1 && rating <= 5) {
                ratingCounts[rating - 1]++;
            }
        });
        ratingsChart.data.datasets[0].data = ratingCounts;
        ratingsChart.update();
    }

    function updateGenreChart() {
        genreCounts = {};
        document.querySelectorAll(".movie-card").forEach(card => {
            const genre = card.dataset.genre || "Otro";
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });

        genreChart.data.labels = Object.keys(genreCounts);
        genreChart.data.datasets[0].data = Object.values(genreCounts);
        genreChart.update();
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("movie-title").value.trim();
        const director = document.getElementById("director").value.trim();
        const releaseDate = document.getElementById("release-date").value;
        const genre = document.getElementById("genre").value;
        const synopsis = document.getElementById("synopsis").value.trim();
        const review = document.getElementById("review").value.trim();
        const favQuote = document.getElementById("fav-quote").value.trim();
        const rating = document.getElementById("rating").value;
        const imageInput = document.getElementById("movie-image");

        let imageURL = "https://via.placeholder.com/250x350?text=Sin+Imagen";
        if (imageInput.files && imageInput.files[0]) {
            imageURL = URL.createObjectURL(imageInput.files[0]);
        }

        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.dataset.rating = String(rating);
        card.dataset.releaseDate = releaseDate;
        card.dataset.genre = genre;

        card.innerHTML = `
            <div class="movie-card__actions">
                <button type="button" class="btn-edit">Editar</button>
                <button type="button" class="btn-delete">Eliminar</button>
            </div>

            <div class="movie-card__image">
                <img class="val-image" src="${imageURL}" alt="${title}">
            </div>

            <div class="movie-card__details">
                <div class="field"><strong>Título:</strong> <span class="val-title">${title}</span></div>
                <div class="field"><strong>Director:</strong> <span class="val-director">${director}</span></div>
                <div class="field"><strong>Fecha:</strong> <span class="val-date">${releaseDate}</span></div>
                <div class="field"><strong>Género:</strong> <span class="val-genre">${genre}</span></div>
                <div class="field"><strong>Calificación:</strong> <span class="val-rating">${"★".repeat(rating)}</span></div>
                <div class="field"><strong>Frase Favorita:</strong> <span class="val-fav">${favQuote || "—"}</span></div>
            </div>

            <div class="movie-card__synopsis">
                <h6>Sinopsis</h6>
                <p class="val-synopsis">${synopsis}</p>
            </div>

            <div class="movie-card__review">
                <h6>Reseña / Opinión</h6>
                <p class="val-review">${review}</p>
            </div>
        `;

        movieCards.appendChild(card);
        form.reset();

        updateRatingsChart();
        updateGenreChart();
    });

    movieCards.addEventListener("click", (ev) => {
        const btnEdit = ev.target.closest(".btn-edit");
        const btnDelete = ev.target.closest(".btn-delete");

        if (btnEdit) {
            currentEditCard = btnEdit.closest(".movie-card");
            if (!currentEditCard) return;

            eTitle.value = currentEditCard.querySelector(".val-title").textContent;
            eDirector.value = currentEditCard.querySelector(".val-director").textContent;
            eDate.value = currentEditCard.dataset.releaseDate || currentEditCard.querySelector(".val-date").textContent;
            eGenre.value = currentEditCard.dataset.genre || currentEditCard.querySelector(".val-genre").textContent;
            eSynopsis.value = currentEditCard.querySelector(".val-synopsis").textContent;
            eReview.value = currentEditCard.querySelector(".val-review").textContent;
            eFav.value = currentEditCard.querySelector(".val-fav").textContent === "—" ? "" : currentEditCard.querySelector(".val-fav").textContent;
            eRating.value = currentEditCard.dataset.rating || String((currentEditCard.querySelector(".val-rating").textContent || "").length);
            eImage.value = "";

            editModal.show();
            return;
        }

        if (btnDelete) {
            const card = btnDelete.closest(".movie-card");
            if (card && confirm("¿Eliminar esta película?")) {
                card.remove();
                updateRatingsChart();
                updateGenreChart();
            }
            return;
        }
    });

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!currentEditCard) return;

        const nTitle = eTitle.value.trim();
        const nDirector = eDirector.value.trim();
        const nDate = eDate.value;
        const nGenre = eGenre.value;
        const nSynopsis = eSynopsis.value.trim();
        const nReview = eReview.value.trim();
        const nFav = eFav.value.trim() || "—";
        const nRating = eRating.value;
        const nImageFile = eImage.files && eImage.files[0];

        currentEditCard.querySelector(".val-title").textContent = nTitle;
        currentEditCard.querySelector(".val-director").textContent = nDirector;
        currentEditCard.querySelector(".val-date").textContent = nDate;
        currentEditCard.querySelector(".val-genre").textContent = nGenre;
        currentEditCard.querySelector(".val-synopsis").textContent = nSynopsis;
        currentEditCard.querySelector(".val-review").textContent = nReview;
        currentEditCard.querySelector(".val-fav").textContent = nFav;
        currentEditCard.querySelector(".val-rating").textContent = "★".repeat(nRating);

        currentEditCard.dataset.releaseDate = nDate;
        currentEditCard.dataset.genre = nGenre;
        currentEditCard.dataset.rating = String(nRating);

        if (nImageFile) {
            const newURL = URL.createObjectURL(nImageFile);
            currentEditCard.querySelector(".val-image").src = newURL;
        }

        editModal.hide();
        currentEditCard = null;

        updateRatingsChart();
        updateGenreChart();
    });
});

