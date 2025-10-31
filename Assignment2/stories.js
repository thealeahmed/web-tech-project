// Function to fetch and display stories
function displayStories() {
  var storiesList = $("#storiesList");
  storiesList.html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>');
  
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    dataType: "json",
    timeout: 10000, // 10 second timeout
    success: handleResponse,
    error: function (xhr, status, error) {
      storiesList.html('<div class="alert alert-danger" role="alert">Failed to load stories. Please check your internet connection and try again.</div>');
    },
  });
}

function handleResponse(data) {
  var storiesList = $("#storiesList");
  storiesList.empty();

  // Limit to first 10 posts for better display
  var limitedData = data.slice(0, 10);

  $.each(limitedData, function (index, story) {
    storiesList.append(
      `<div class="mb-3">
            <h3>${story.title}</h3>
            <div>${story.body}</div>
            <div>
                <button class="btn btn-info btn-sm me-2 btn-edit" data-id="${story.id}">Edit</button>
                <button class="btn btn-danger btn-sm me-2 btn-del" data-id="${story.id}">Delete</button>
            </div>
        </div>
        <hr />
        `
    );
  });
}

// Function to delete a story
function deleteStory() {
  let storyId = $(this).attr("data-id");
  
  if (confirm("Are you sure you want to delete this story?")) {
    $(this).prop("disabled", true).text("Deleting...");
    
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts/" + storyId,
      method: "DELETE",
      timeout: 10000,
      success: function (response) {
        console.log("Delete successful:", response);
        displayStories(); // Refresh the list after deleting a story
        alert("Story deleted successfully!");
      },
      error: function (xhr, status, error) {
        console.error("Error deleting story:", error);
        alert("Failed to delete story. Please try again.");
      },
      complete: function() {
        // Re-enable button
        $(".btn-del[data-id='" + storyId + "']").prop("disabled", false).text("Delete");
      }
    });
  }
}

function handleFormSubmission(event) {
  event.preventDefault();
  let storyId = $("#createBtn").attr("data-id");
  var title = $("#createTitle").val().trim();
  var content = $("#createContent").val().trim();
  
  // Basic validation
  if (!title || !content) {
    alert("Please fill in both title and content fields.");
    return;
  }
  
  // Disable form during submission
  $("#createBtn").prop("disabled", true).text("Saving...");
  
  if (storyId) {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts/" + storyId,
      method: "PUT",
      data: { 
        id: storyId,
        title: title, 
        body: content,
        userId: 1
      },
      timeout: 10000,
      success: function (response) {
        console.log("Update successful:", response);
        displayStories(); // Refresh the list after updating a story
        // Clear form after successful update
        $("#clearBtn").hide();
        $("#createBtn").removeAttr("data-id");
        $("#createBtn").html("Create");
        $("#createTitle").val("");
        $("#createContent").val("");
        alert("Story updated successfully!");
      },
      error: function (xhr, status, error) {
        console.error("Error updating story:", error);
        alert("Failed to update story. Please try again.");
      },
      complete: function() {
        $("#createBtn").prop("disabled", false);
      }
    });
  } else {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      data: { 
        title: title, 
        body: content,
        userId: 1
      },
      timeout: 10000,
      success: function (response) {
        console.log("Create successful:", response);
        displayStories(); // Refresh the list after creating a new story
        // Clear form after successful creation
        $("#createTitle").val("");
        $("#createContent").val("");
        alert("Story created successfully!");
      },
      error: function (xhr, status, error) {
        console.error("Error creating story:", error);
        alert("Failed to create story. Please try again.");
      },
      complete: function() {
        $("#createBtn").prop("disabled", false);
      }
    });
  }
}

function editBtnClicked(event) {
  event.preventDefault();
  let storyId = $(this).attr("data-id");
  
  $(this).prop("disabled", true).text("Loading...");
  
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/" + storyId,
    method: "GET",
    timeout: 10000,
    success: function (data) {
      console.log("Edit data loaded:", data);
      $("#clearBtn").show();
      $("#createTitle").val(data.title);
      $("#createContent").val(data.body);
      $("#createBtn").html("Update");
      $("#createBtn").attr("data-id", data.id);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching story:", error);
      alert("Failed to load story for editing. Please try again.");
    },
    complete: function() {
      // Re-enable button
      $(".btn-edit[data-id='" + storyId + "']").prop("disabled", false).text("Edit");
    }
  });
}

$(document).ready(function () {
  // Initial display of stories
  displayStories();
  $(document).on("click", ".btn-del", deleteStory);
  $(document).on("click", ".btn-edit", editBtnClicked);
  // Create Form Submission
  $("#createForm").submit(handleFormSubmission);
  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    $("#clearBtn").hide();
    $("#createBtn").removeAttr("data-id");
    $("#createBtn").html("Create");
    $("#createTitle").val("");
    $("#createContent").val("");
  });
});
