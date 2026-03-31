const API_URL = 'https://dummyjson.com/users';

let users = [];

// Extract array from any API response
function extractUsers(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.users)) return data.users;
    if (Array.isArray(data.data)) return data.data;
    return [];
}

// Normalize user object
function normalizeUser(user) {
    return {
        name: user.name || `${user.firstName || ""} ${user.lastName || ""}`,
        email: user.email || "No Email",
        company: user.company?.name || "No Company"
    };
}

// Status message
function setStatus(message, isError = false) {
    const status = document.getElementById("status");
    status.textContent = message;
    status.style.color = isError ? "red" : "black";
}

// Show/Hide spinner
function showSpinner() {
    document.getElementById("spinner").classList.remove("hidden");
}

function hideSpinner() {
    document.getElementById("spinner").classList.add("hidden");
}

// Display users
function displayUsers(usersArray) {
    const container = document.getElementById("userList");
    container.innerHTML = "";

    if (usersArray.length === 0) {
        container.innerHTML = "<p>No users found</p>";
        return;
    }

    usersArray.forEach(user => {
        const u = normalizeUser(user);

        const div = document.createElement("div");
        div.classList.add("user");

        div.innerHTML = `
            <h3>${u.name}</h3>
            <p>${u.email}</p>
            <p>${u.company}</p>
        `;

        div.addEventListener("click", () => {
            openModal(u);
        });

        container.appendChild(div);
    });
}

// Fetch users from API
async function fetchUsers() {
    showSpinner();
    setStatus("Loading users... ");

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        users = extractUsers(data);

        displayUsers(users);
        setStatus("");
    } catch (error) {
        console.log(error);
        setStatus("⚠️ Failed to load users. Showing offline data.", true);

        users = [
            { firstName: "Salma", lastName: "Atef", email: "test@test.com", company: { name: "IBM" } },
           
        ];

        displayUsers(users);
    } finally {
        hideSpinner();
    }
}

// Modal
function openModal(user) {
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");

    modalBody.innerHTML = `
        <h2>${user.name}</h2>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Company:</strong> ${user.company}</p>
    `;

    modal.classList.remove("hidden");
}

document.getElementById("closeBtn").onclick = function () {
    document.getElementById("modal").classList.add("hidden");
};

window.onclick = function (e) {
    const modal = document.getElementById("modal");
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
};

// Search filter
window.onload = function () {
    fetchUsers();

    const searchInput = document.getElementById("search");

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase();

        const filteredUsers = users.filter(user => {
            const u = normalizeUser(user);
            return u.name.toLowerCase().includes(value);
        });

        displayUsers(filteredUsers);
    });
};