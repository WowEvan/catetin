document.addEventListener("DOMContentLoaded", function () {
    const listItems = document.querySelectorAll(".clickable-item");
    const dynamicImage = document.getElementById("dynamic_image");

    if (listItems.length > 0) {
        listItems[0].classList.add("active");
        const firstImageSrc = listItems[0].getAttribute("data-image");
        dynamicImage.src = firstImageSrc;
    }

    listItems.forEach(item => {
        item.addEventListener("click", function () {
            listItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
            const newImageSrc = this.getAttribute("data-image");
            dynamicImage.src = newImageSrc;
        });
    });
});