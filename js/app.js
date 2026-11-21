
// ======================================
// LEGALDESK - DOCUMENT REVIEW SYSTEM
// ======================================

// Sample documents displayed when the project is opened for the first time.

let documents = JSON.parse(localStorage.getItem("legalDeskDocuments"));

if (documents === null) {
    documents = [
        {
            id: 1,
            title: "Employment Agreement",
            category: "Contract",
            summary: "Agreement covering employment terms, responsibilities, salary and working conditions.",
            reviewer: "Rahul Sharma",
            priority: "High",
            status: "Pending",
            tags: ["Employment", "Important"],
            comments: [],
            history: [
                {
                    activity: "Document added to LegalDesk",
                    date: new Date().toLocaleString()
                }
            ]
        },
        {
            id: 2,
            title: "Non-Disclosure Agreement",
            category: "Agreement",
            summary: "Agreement describing confidentiality responsibilities and protection of sensitive information.",
            reviewer: "Priya Verma",
            priority: "Medium",
            status: "Approved",
            tags: ["Confidentiality", "Legal"],
            comments: [],
            history: [
                {
                    activity: "Document added to LegalDesk",
                    date: new Date().toLocaleString()
                }
            ]
        },
        {
            id: 3,
            title: "Company Privacy Policy",
            category: "Policy",
            summary: "Policy explaining how company information and personal data are handled.",
            reviewer: "Aman Gupta",
            priority: "Low",
            status: "Changes Required",
            tags: ["Privacy", "Policy"],
            comments: [],
            history: [
                {
                    activity: "Document added to LegalDesk",
                    date: new Date().toLocaleString()
                }
            ]
        }
    ];

    saveDocuments();
}

let selectedDocumentId = null;
let editingDocumentId = null;


// ======================================
// COMMON FUNCTIONS
// ======================================

// Save documents in the browser.

function saveDocuments() {
    localStorage.setItem("legalDeskDocuments", JSON.stringify(documents));
}


// Find a document using its ID.

function getSelectedDocument() {
    for (let i = 0; i < documents.length; i++) {
        if (documents[i].id === selectedDocumentId) {
            return documents[i];
        }
    }

    return null;
}


// Add an activity to document history.

function addHistory(doc, activity) {
    if (!doc.history) {
        doc.history = [];
    }

    doc.history.unshift({
        activity: activity,
        date: new Date().toLocaleString()
    });
}


// Protect text before displaying it in HTML.

function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}


// Create a CSS class for a status.

function getStatusClass(status) {
    if (status === "Approved") {
        return "status-approved";
    }

    if (status === "Changes Required") {
        return "status-changes-required";
    }

    return "status-pending";
}


// Create a CSS class for priority.

function getPriorityClass(priority) {
    if (priority === "High") {
        return "priority-high";
    }

    if (priority === "Low") {
        return "priority-low";
    }

    return "priority-medium";
}


// ======================================
// DASHBOARD
// ======================================

function updateDashboard() {
    let total = documents.length;
    let pending = 0;
    let approved = 0;
    let changes = 0;

    for (let i = 0; i < documents.length; i++) {
        if (documents[i].status === "Pending") {
            pending++;
        } else if (documents[i].status === "Approved") {
            approved++;
        } else if (documents[i].status === "Changes Required") {
            changes++;
        }
    }

    document.getElementById("totalCount").textContent = total;
    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("approvedCount").textContent = approved;
    document.getElementById("changesCount").textContent = changes;
}


// ======================================
// DISPLAY DOCUMENTS
// ======================================

function displayDocuments() {
    let table = document.getElementById("documentTable");
    let searchText = document.getElementById("searchInput").value.toLowerCase();
    let selectedStatus = document.getElementById("statusFilter").value;

    let html = "";
    let found = 0;

    for (let i = 0; i < documents.length; i++) {
        let doc = documents[i];

        let searchableText = (
            doc.title + " " +
            doc.category + " " +
            doc.reviewer
        ).toLowerCase();

        let matchesSearch = searchableText.includes(searchText);
        let matchesStatus = selectedStatus === "All" ||
                            doc.status === selectedStatus;

        if (matchesSearch && matchesStatus) {
            found++;

            html += `
                <tr>
                    <td>
                        <div class="document-name">${escapeHTML(doc.title)}</div>
                        <div class="document-subtitle">Document ID: LD-${doc.id}</div>
                    </td>

                    <td>${escapeHTML(doc.category)}</td>

                    <td>${escapeHTML(doc.reviewer)}</td>

                    <td>
                        <span class="priority-badge ${getPriorityClass(doc.priority)}">
                            ${escapeHTML(doc.priority)}
                        </span>
                    </td>

                    <td>
                        <span class="status-badge ${getStatusClass(doc.status)}">
                            ${escapeHTML(doc.status)}
                        </span>
                    </td>

                    <td>
                        <button class="view-button" data-id="${doc.id}">
                            View Details
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    table.innerHTML = html;

    if (found === 0) {
        document.getElementById("emptyMessage").style.display = "block";
    } else {
        document.getElementById("emptyMessage").style.display = "none";
    }

    updateDashboard();
}


// ======================================
// SHOW DOCUMENT DETAILS
// ======================================

function showDocumentDetails(id) {
    selectedDocumentId = id;

    let doc = getSelectedDocument();

    if (doc === null) {
        return;
    }

    document.getElementById("detailsSection").style.display = "block";

    document.getElementById("detailsContent").innerHTML = `
        <div class="document-detail-box">
            <h3>${escapeHTML(doc.title)}</h3>

            <p><strong>Document ID:</strong> LD-${doc.id}</p>
            <p><strong>Category:</strong> ${escapeHTML(doc.category)}</p>
            <p><strong>Summary:</strong> ${escapeHTML(doc.summary || "No summary available")}</p>
            <p><strong>Reviewer:</strong> ${escapeHTML(doc.reviewer)}</p>
            <p><strong>Status:</strong> ${escapeHTML(doc.status)}</p>
            <p><strong>Priority:</strong> ${escapeHTML(doc.priority)}</p>
        </div>
    `;

    document.getElementById("newDocumentStatus").value = doc.status;
    document.getElementById("newReviewer").value = doc.reviewer;
    document.getElementById("newPriority").value = doc.priority;

    renderTags(doc);
    renderComments(doc);
    renderHistory(doc);

    document.getElementById("detailsSection").scrollIntoView({
        behavior: "smooth"
    });
}


// ======================================
// RENDER TAGS
// ======================================

function renderTags(doc) {
    let tagArea = document.getElementById("tagsList");

    if (!doc.tags || doc.tags.length === 0) {
        tagArea.innerHTML = '<p class="no-data">No tags added yet.</p>';
        return;
    }

    let html = "";

    for (let i = 0; i < doc.tags.length; i++) {
        html += `
            <span class="tag">
                ${escapeHTML(doc.tags[i])}
                <button type="button" data-tag-index="${i}" aria-label="Remove tag">×</button>
            </span>
        `;
    }

    tagArea.innerHTML = html;
}


// ======================================
// RENDER COMMENTS
// ======================================

function renderComments(doc) {
    let commentArea = document.getElementById("commentsList");

    if (!doc.comments || doc.comments.length === 0) {
        commentArea.innerHTML = '<p class="no-data">No reviewer comments yet.</p>';
        return;
    }

    let html = "";

    for (let i = 0; i < doc.comments.length; i++) {
        html += `
            <div class="comment-item">
                <p>${escapeHTML(doc.comments[i].text)}</p>
                <small>${escapeHTML(doc.comments[i].date)}</small>
            </div>
        `;
    }

    commentArea.innerHTML = html;
}


// ======================================
// RENDER DOCUMENT HISTORY
// ======================================

function renderHistory(doc) {
    let historyArea = document.getElementById("historyList");

    if (!doc.history || doc.history.length === 0) {
        historyArea.innerHTML = '<p class="no-data">No history available.</p>';
        return;
    }

    let html = "";

    for (let i = 0; i < doc.history.length; i++) {
        html += `
            <div class="history-item">
                <p>${escapeHTML(doc.history[i].activity)}</p>
                <small>${escapeHTML(doc.history[i].date)}</small>
            </div>
        `;
    }

    historyArea.innerHTML = html;
}


// ======================================
// ADD AND EDIT DOCUMENT
// ======================================

document.getElementById("documentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let title = document.getElementById("documentTitle").value.trim();
    let category = document.getElementById("documentCategory").value;
    let summary = document.getElementById("documentSummary").value.trim();
    let reviewer = document.getElementById("documentReviewer").value.trim();
    let priority = document.getElementById("documentPriority").value;

    if (title === "" || category === "" || reviewer === "") {
        alert("Please fill in all required fields.");
        return;
    }

    if (editingDocumentId !== null) {
        let doc = null;

        for (let i = 0; i < documents.length; i++) {
            if (documents[i].id === editingDocumentId) {
                doc = documents[i];
                break;
            }
        }

        if (doc !== null) {
            doc.title = title;
            doc.category = category;
            doc.summary = summary;
            doc.reviewer = reviewer;
            doc.priority = priority;

            addHistory(doc, "Document details updated");
        }

        editingDocumentId = null;

    } else {
        let newDocument = {
            id: Date.now(),
            title: title,
            category: category,
            summary: summary,
            reviewer: reviewer,
            priority: priority,
            status: "Pending",
            tags: [],
            comments: [],
            history: []
        };

        addHistory(newDocument, "Document added to LegalDesk");
        documents.unshift(newDocument);
    }

    saveDocuments();
    displayDocuments();
    resetDocumentForm();

    alert("Document saved successfully.");
});


// ======================================
// RESET FORM
// ======================================

function resetDocumentForm() {
    document.getElementById("documentForm").reset();

    editingDocumentId = null;

    document.getElementById("formHeading").textContent = "Add New Document";
    document.getElementById("saveDocumentBtn").textContent = "Save Document";
}


// ======================================
// OPEN ADD DOCUMENT FORM
// ======================================

function openAddForm() {
    resetDocumentForm();

    document.getElementById("addDocumentSection").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("documentTitle").focus();
}

document.getElementById("showAddFormBtn").addEventListener("click", openAddForm);

document.getElementById("cancelFormBtn").addEventListener("click", function() {
    resetDocumentForm();
    document.getElementById("documents").scrollIntoView({
        behavior: "smooth"
    });
});


// ======================================
// EDIT DOCUMENT
// ======================================

document.getElementById("editDocumentBtn").addEventListener("click", function() {
    let doc = getSelectedDocument();

    if (doc === null) {
        return;
    }

    editingDocumentId = doc.id;

    document.getElementById("documentTitle").value = doc.title;
    document.getElementById("documentCategory").value = doc.category;
    document.getElementById("documentSummary").value = doc.summary || "";
    document.getElementById("documentReviewer").value = doc.reviewer;
    document.getElementById("documentPriority").value = doc.priority;

    document.getElementById("formHeading").textContent = "Edit Document";
    document.getElementById("saveDocumentBtn").textContent = "Update Document";

    document.getElementById("addDocumentSection").scrollIntoView({
        behavior: "smooth"
    });
});


// ======================================
// DELETE DOCUMENT
// ======================================

document.getElementById("deleteDocumentBtn").addEventListener("click", function() {
    let doc = getSelectedDocument();

    if (doc === null) {
        return;
    }

    let answer = confirm("Are you sure you want to delete this document?");

    if (answer) {
        let newDocuments = [];

        for (let i = 0; i < documents.length; i++) {
            if (documents[i].id !== selectedDocumentId) {
                newDocuments.push(documents[i]);
            }
        }

        documents = newDocuments;
        selectedDocumentId = null;

        saveDocuments();
        displayDocuments();

        document.getElementById("detailsSection").style.display = "none";

        alert("Document deleted successfully.");
    }
});


// ======================================
// VIEW DOCUMENT DETAILS
// ======================================

document.getElementById("documentTable").addEventListener("click", function(event) {
    let id = event.target.getAttribute("data-id");

    if (id !== null) {
        showDocumentDetails(Number(id));
    }
});

document.getElementById("closeDetailsBtn").addEventListener("click", function() {
    document.getElementById("detailsSection").style.display = "none";
    selectedDocumentId = null;
});


// ======================================
// SEARCH AND FILTER
// ======================================

document.getElementById("searchInput").addEventListener("input", function() {
    displayDocuments();
});

document.getElementById("statusFilter").addEventListener("change", function() {
    displayDocuments();
});


// ======================================
// UPDATE DOCUMENT STATUS
// ======================================

document.getElementById("updateStatusBtn").addEventListener("click", function() {
    let doc = getSelectedDocument();

    if (doc === null) {
        return;
    }

    let newStatus = document.getElementById("newDocumentStatus").value;

    doc.status = newStatus;

    addHistory(doc, "Review status changed to " + newStatus);

    saveDocuments();
    displayDocuments();
    showDocumentDetails(doc.id);
});


// ======================================
// UPDATE REVIEWER
// ======================================

document.getElementById("updateReviewerBtn").addEventListener("click", function() {
    let doc = getSelectedDocument();

    if (doc === null) {
        return;
    }

    let newReviewer = document.getElementById("newReviewer").value.trim();

    if (newReviewer === "") {
        alert("Please enter a reviewer name.");
        return;
    }

    doc.reviewer = newReviewer;

    addHistory(doc, "Reviewer assigned to " + newReviewer);

    saveDocuments();
    displayDocuments();
    showDocumentDetails(doc.id);
});


// ======================================
// UPDATE PRIORITY
// ======================================

document.getElementById("updatePriorityBtn").addEventListener("click", function() {
    let doc = getSelectedDocument();

    if (doc === null) {
        return;
    }

    let newPriority = document.getElementById("newPriority").value;

    doc.priority = newPriority;

    addHistory(doc, "Priority changed to " + newPriority);

    saveDocuments();
    displayDocuments();
    showDocumentDetails(doc.id);
});


// ======================================
// ADD TAG
// ======================================

document.getElementById("addTagBtn").addEventListener("click", function() {
    let doc = getSelectedDocument();

    if (doc === null) {
        return;
    }

    let tagValue = document.getElementById("newTag").value.trim();

    if (tagValue === "") {
        alert("Please enter a tag.");
        return;
    }

    if (!doc.tags) {
        doc.tags = [];
    }

    let tagExists = false;

    for (let i = 0; i < doc.tags.length; i++) {
        if (doc.tags[i].toLowerCase() === tagValue.toLowerCase()) {
            tagExists = true;
        }
    }

    if (tagExists) {
        alert("This tag already exists.");
        return;
    }

    doc.tags.push(tagValue);

    addHistory(doc, "Tag added: " + tagValue);

    document.getElementById("newTag").value = "";

    saveDocuments();
    showDocumentDetails(doc.id);
});


// ======================================
// REMOVE TAG
// ======================================

document.getElementById("tagsList").addEventListener("click", function(event) {
    let index = event.target.getAttribute("data-tag-index");

    if (index === null) {
        return;
    }

    let doc = getSelectedDocument();

    if (doc === null) {
        return;
    }

    let removedTag = doc.tags[Number(index)];

    doc.tags.splice(Number(index), 1);

    addHistory(doc, "Tag removed: " + removedTag);

    saveDocuments();
    showDocumentDetails(doc.id);
});


// ======================================
// ADD REVIEWER COMMENT
// ======================================

document.getElementById("addCommentBtn").addEventListener("click", function() {
    let doc = getSelectedDocument();

    if (doc === null) {
        return;
    }

    let commentText = document.getElementById("newComment").value.trim();

    if (commentText === "") {
        alert("Please enter a comment.");
        return;
    }

    if (!doc.comments) {
        doc.comments = [];
    }

    doc.comments.push({
        text: commentText,
        date: new Date().toLocaleString()
    });

    addHistory(doc, "Reviewer comment added");

    document.getElementById("newComment").value = "";

    saveDocuments();
    showDocumentDetails(doc.id);
});


// ======================================
// INITIAL DISPLAY
// ======================================

displayDocuments();
