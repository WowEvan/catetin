let currentPage = 1;
const itemsPerPage = 3;
let totalPages = 1;
let data = [];

document.addEventListener("DOMContentLoaded", async () => {
    const notesContainer = document.querySelector(".notes_container");
    const pageNumbersContainer = document.querySelector(".page-numbers");

    const response = await fetch("get_upload_history.php");
    const responseData = await response.json();

    if (responseData.data.length > 0) {
        data = responseData.data;
        totalPages = Math.ceil(data.length / itemsPerPage);
        renderPage(pageNumbersContainer, totalPages);

        renderNotes(data, currentPage);
    } else {
        notesContainer.innerHTML = "<p>No notes available for sale at the moment.</p>";
    }
});

async function renderNotes(notes, page) {
    const notesContainer = document.querySelector(".notes_container");
    notesContainer.innerHTML = "";

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const notesToShow = notes.slice(startIndex, endIndex);

    for (const note of notesToShow) {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note_card");

        const previewContainer = document.createElement("div");
        previewContainer.classList.add("pdf-preview");

        const canvas = document.createElement("canvas");
        previewContainer.appendChild(canvas);

        await generatePdfPreview(`http://localhost/Catetin/uploads/${note.filename}`, canvas);

        noteCard.innerHTML = `
            <h3>${note.filename}</h3>
            <div class="total_dibeli">Total Dibeli: ${note.total_dibeli}</div>
            <button class="buy_button" onclick="buyNote('${note.id}')">Buy</button>
        `;

        noteCard.prepend(previewContainer);

        notesContainer.appendChild(noteCard);
    }
}

async function generatePdfPreview(pdfUrl, canvas) {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(1);

        const scale = 0.2;
        const viewport = page.getViewport({ scale: scale });

        const context = canvas.getContext("2d");
        canvas.height = 100;
        canvas.width = 100;

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
    } catch (error) {
        console.error("Error generating PDF preview:", error);
    }
}

function renderPage(container, totalPages) {
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("page-btn");
        pageBtn.setAttribute("data-page", i);

        if (i === currentPage) {
            pageBtn.classList.add("active");
        }

        pageBtn.addEventListener("click", () => {
            currentPage = i;
            renderNotes(data, currentPage);
            updateActivePage(container);
        });

        container.appendChild(pageBtn);
    }
}

function updateActivePage(container) {
    const pageButtons = container.querySelectorAll(".page-btn");
    pageButtons.forEach(btn => btn.classList.remove("active"));
    container.querySelector(`[data-page="${currentPage}"]`).classList.add("active");
}

function changePage(direction) {
    if (direction === "prev" && currentPage > 1) {
        currentPage--;
    } else if (direction === "next" && currentPage < totalPages) {
        currentPage++;
    }

    renderNotes(data, currentPage);
    updateActivePage(document.querySelector(".page-numbers"));
}