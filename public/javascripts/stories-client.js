// Stories CRUD - Client-side JavaScript

function displayStories() {
    const storiesList = $("#storiesList");
    storiesList.html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>');

    $.ajax({
        url: "https://jsonplaceholder.typicode.com/posts",
        method: "GET",
        dataType: "json",
        timeout: 10000,
        success: handleStoriesResponse,
        error: function (xhr, status, error) {
            storiesList.html('<div class="alert alert-danger" role="alert">Failed to load stories. Please check your internet connection and try again.</div>');
        }
    });
}

function handleStoriesResponse(data) {
    const storiesList = $("#storiesList");
    storiesList.empty();

    // Limit to first 10 posts for better display
    var limitedData = data.slice(0, 10);

    if (limitedData.length === 0) {
        storiesList.html('<div class="alert alert-info">No stories yet. Be the first to share your story!</div>');
        return;
    }

    $.each(limitedData, function (index, story) {
        storiesList.append(
            `<div class="story-item mb-3">
                <h5 class="story-title">${escapeHtml(story.title)}</h5>
                <p class="story-content">${escapeHtml(story.body)}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="story-meta">By User ${story.userId}</div>
                    <div>
                        <button class="btn btn-info btn-sm me-2 btn-edit" data-id="${story.id}">Edit</button>
                        <button class="btn btn-danger btn-sm btn-del" data-id="${story.id}">Delete</button>
                    </div>
                </div>
            </div>`
        );
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function deleteStory() {
    const storyId = $(this).attr("data-id");

    if (confirm("Are you sure you want to delete this story?")) {
        $(this).prop("disabled", true).text("Deleting...");

        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts/" + storyId,
            method: "DELETE",
            timeout: 10000,
            success: function (response) {
                displayStories();
                alert("Story deleted successfully!");
            },
            error: function (xhr, status, error) {
                alert("Failed to delete story. Please try again.");
            }
        });
    }
}

function handleFormSubmission(event) {
    event.preventDefault();
    const storyId = $("#createBtn").attr("data-id");
    const title = $("#createTitle").val().trim();
    const content = $("#createContent").val().trim();
    const author = $("#createAuthor").val().trim() || "Anonymous";

    if (!title || !content) {
        alert("Please fill in both title and content fields.");
        return;
    }

    $("#createBtn").prop("disabled", true).text("Saving...");

    if (storyId) {
        // Update existing story
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts/" + storyId,
            method: "PUT",
            data: { id: storyId, title, body: content, userId: 1 },
            timeout: 10000,
            success: function (response) {
                displayStories();
                clearForm();
                alert("Story updated successfully!");
            },
            error: function (xhr, status, error) {
                alert("Failed to update story. Please try again.");
            },
            complete: function () {
                $("#createBtn").prop("disabled", false).text("Create");
            }
        });
    } else {
        // Create new story
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts",
            method: "POST",
            data: { title, body: content, userId: 1 },
            timeout: 10000,
            success: function (response) {
                displayStories();
                clearForm();
                alert("Story created successfully!");
            },
            error: function (xhr, status, error) {
                alert("Failed to create story. Please try again.");
            },
            complete: function () {
                $("#createBtn").prop("disabled", false);
            }
        });
    }
}

function editBtnClicked(event) {
    event.preventDefault();
    const storyId = $(this).attr("data-id");

    $(this).prop("disabled", true).text("Loading...");

    $.ajax({
        url: "https://jsonplaceholder.typicode.com/posts/" + storyId,
        method: "GET",
        timeout: 10000,
        success: function (data) {
            $("#clearBtn").show();
            $("#createTitle").val(data.title);
            $("#createContent").val(data.body);
            $("#createAuthor").val("User " + data.userId);
            $("#createBtn").html("Update");
            $("#createBtn").attr("data-id", data.id);

            // Scroll to form
            $('html, body').animate({
                scrollTop: $("#createForm").offset().top - 100
            }, 500);
        },
        error: function (xhr, status, error) {
            alert("Failed to load story for editing. Please try again.");
        },
        complete: function () {
            $(".btn-edit[data-id='" + storyId + "']").prop("disabled", false).text("Edit");
        }
    });
}

function clearForm() {
    $("#clearBtn").hide();
    $("#createBtn").removeAttr("data-id");
    $("#createBtn").html("Create");
    $("#createTitle").val("");
    $("#createContent").val("");
    $("#createAuthor").val("");
}

$(document).ready(function () {
    displayStories();
    $(document).on("click", ".btn-del", deleteStory);
    $(document).on("click", ".btn-edit", editBtnClicked);
    $("#createForm").submit(handleFormSubmission);
    $("#clearBtn").on("click", function (e) {
        e.preventDefault();
        clearForm();
    });
});
