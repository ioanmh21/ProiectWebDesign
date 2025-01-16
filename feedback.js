
const feedbackForm = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");

function saveFeedback(feedback) {
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.unshift(feedback);
    feedbacks = feedbacks.slice(0, 5);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
}

function displayFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbackList.innerHTML = feedbacks
        .map(
            (fb) => `
        <div class="response">
            <p><strong>${fb.name}</strong> (${fb.rating} stars)</p>
            <p>${fb.comment}</p>
        </div>`
        )
        .join("");
}

feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const rating = feedbackForm.querySelector('input[name="rating"]:checked');
    if (!rating) {
        alert("Please select a rating!");
        return;
    }

    const comment = document.getElementById("comment").value.trim();
    const name = document.getElementById("name").value.trim();

    if (!comment || !name) {
        alert("Please fill out all fields!");
        return;
    }

    const feedback = {
        rating: rating.value,
        comment,
        name,
    };

    saveFeedback(feedback);
    displayFeedbacks();

    feedbackForm.reset();
});

displayFeedbacks();