async function buyNote(noteId) {
    try {
        const response = await fetch("update_total_dibeli.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ noteId: noteId })
        });

        const result = await response.json();

        if (result.success) {
            alert("Note purchased successfully!");
            const totalDibeliElement = document.querySelector(`button[onclick="buyNote('${noteId}')"]`).previousElementSibling;
            totalDibeliElement.textContent = `Total Dibeli: ${result.newTotalDibeli}`;
        } else {
            alert("Error updating the total dibeli.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
    }
}