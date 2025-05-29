function searchBook() {
    let title = document.getElementById("bookTitle").value;
    let url = `https://openlibrary.org/search.json?title=${title}&limit=12`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        let resultsDiv = document.getElementById("result");
        resultsDiv.innerHTML = ""; // Clear previous results

        if (data.docs.length > 0) {
            resultsDiv.innerHTML = `<div class="book-grid">`; // Start grid container
            
            data.docs.forEach(book => {
                let coverImage = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "default_cover.jpg";

                resultsDiv.innerHTML += `
                    <div class="book-card" onclick="viewDetails('${book.key}')">
                        <img src="${coverImage}" alt="Book Cover">
                        <div class="book-info">
                            <h3>${book.title}</h3>
                            <p><b>Author:</b> ${book.author_name ? book.author_name.join(", ") : "Unknown"}</p>
                            <p><b>Published:</b> ${book.first_publish_year || "N/A"}</p>
                            <button class="save-btn" onclick="event.stopPropagation(); saveBook('${book.title}', '${book.author_name ? book.author_name[0] : "Unknown"}')">Save</button>
                        </div>
                    </div>
                `;
            });

            resultsDiv.innerHTML += `</div>`; // Close grid container
        } else {
            resultsDiv.innerHTML = "<p>No results found!</p>";
        }
    })
    .catch(error => console.error("Error fetching data:", error));
}

function viewDetails(bookKey) {
    let url = `https://openlibrary.org${bookKey}.json`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        let modalDiv = document.getElementById("modal");
        let coverImage = data.covers ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : "default_cover.jpg";

        modalDiv.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal()">&times;</span>
                <img src="${coverImage}" class="modal-cover" alt="Cover">
                <h2>${data.title}</h2>
                <p><b>Author:</b> ${data.authors ? data.authors.map(a => a.name).join(", ") : "Unknown"}</p>
                <p><b>Publisher:</b> ${data.publishers ? data.publishers.map(p => p.name).join(", ") : "Unknown"}</p>
                <p><b>Published Year:</b> ${data.publish_date || "N/A"}</p>
                <p><b>Pages:</b> ${data.number_of_pages || "N/A"}</p>
                <p><b>Subjects:</b> ${data.subjects ? data.subjects.join(", ") : "N/A"}</p>
                <p><b>Description:</b> ${data.description ? data.description.value : "No description available."}</p>
                <button class="save-btn" onclick="saveBook('${data.title}', '${data.authors ? data.authors[0].name : "Unknown"}')">Save Book</button>
            </div>
        `;
        modalDiv.style.display = "block"; // Show modal
    })
    .catch(error => console.error("Error fetching data:", error));
}

function closeModal() {
    document.getElementById("modal").style.display = "none"; // Hide modal
}

function saveBook(title, author) {
    fetch("server.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `title=${title}&author=${author}`
    }).then(response => response.text())
      .then(data => alert(data));
}
