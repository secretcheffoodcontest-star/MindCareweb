// =====================================================
// MINDCARE - FRONTEND JAVASCRIPT
// Render Production Version
// =====================================================

// IMPORTANT:
// Do NOT use localhost or 127.0.0.1 here.
// This is your live Flask server.
const API_URL = "https://mindcareweb-f2qa.onrender.com";


// =====================================================
// HELPER FUNCTION
// =====================================================

async function apiRequest(endpoint, method = "GET", data = null) {

    try {

        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        if (data !== null) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(
            API_URL + endpoint,
            options
        );

        const result = await response.json();

        return result;

    } catch (error) {

        console.error("API Error:", error);

        throw new Error(
            "Cannot connect to server."
        );
    }
}


// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessage(message, success = false) {

    let messageElement =
        document.getElementById("message");

    if (!messageElement) {

        messageElement =
            document.querySelector(".message");

    }

    if (!messageElement) {

        alert(message);
        return;

    }

    messageElement.textContent = message;

    if (success) {

        messageElement.style.color = "green";

    } else {

        messageElement.style.color = "red";

    }
}


// =====================================================
// LOGIN
// =====================================================

async function loginUser() {

    const inputs =
        document.querySelectorAll("input");

    let usernameInput = null;
    let passwordInput = null;

    inputs.forEach(function (input) {

        if (input.type === "password") {

            passwordInput = input;

        }

        else if (
            input.type === "text" ||
            input.type === "email"
        ) {

            if (!usernameInput) {

                usernameInput = input;

            }

        }

    });


    if (!usernameInput || !passwordInput) {

        showMessage(
            "Username or password field not found."
        );

        return;

    }


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value.trim();


    if (username === "" || password === "") {

        showMessage(
            "Please enter username and password."
        );

        return;

    }


    try {

        showMessage("Logging in...");


        const result = await apiRequest(
            "/login",
            "POST",
            {
                username: username,
                password: password
            }
        );


        if (result.success) {

            // Save logged-in user
            localStorage.setItem(
                "mindcare_user",
                JSON.stringify(result.user)
            );

            localStorage.setItem(
                "user_id",
                result.user.id
            );


            showMessage(
                "Login successful.",
                true
            );


            // Redirect to dashboard
            window.location.href =
                "dashboard.html";

        }

        else {

            showMessage(
                result.message ||
                "Invalid username or password."
            );

        }

    }

    catch (error) {

        showMessage(
            "Cannot connect to server."
        );

        console.error(error);

    }
}


// =====================================================
// REGISTER
// =====================================================

async function registerUser() {

    const inputs =
        document.querySelectorAll("input");

    let username = "";
    let password = "";
    let name = "";


    inputs.forEach(function (input) {

        const value =
            input.value.trim();

        const placeholder =
            (input.placeholder || "").toLowerCase();

        const nameAttr =
            (input.name || "").toLowerCase();


        if (
            placeholder.includes("username") ||
            nameAttr === "username"
        ) {

            username = value;

        }

        else if (
            input.type === "password" ||
            placeholder.includes("password") ||
            nameAttr === "password"
        ) {

            password = value;

        }

        else if (
            placeholder.includes("name") ||
            nameAttr === "name"
        ) {

            name = value;

        }

    });


    if (name === "") {

        const nameInput =
            document.querySelector(
                'input[name="name"]'
            );

        if (nameInput) {

            name = nameInput.value.trim();

        }

    }


    if (username === "") {

        const usernameInput =
            document.querySelector(
                'input[name="username"]'
            );

        if (usernameInput) {

            username =
                usernameInput.value.trim();

        }

    }


    if (password === "") {

        const passwordInput =
            document.querySelector(
                'input[name="password"]'
            );

        if (passwordInput) {

            password =
                passwordInput.value.trim();

        }

    }


    if (
        username === "" ||
        password === "" ||
        name === ""
    ) {

        showMessage(
            "Please fill all required fields."
        );

        return;

    }


    try {

        showMessage(
            "Creating account..."
        );


        const result =
            await apiRequest(
                "/register",
                "POST",
                {
                    username: username,
                    password: password,
                    name: name
                }
            );


        if (result.success) {

            showMessage(
                "Registration successful. Please login.",
                true
            );

            setTimeout(function () {

                window.location.href =
                    "Index.html";

            }, 1000);

        }

        else {

            showMessage(
                result.message ||
                "Registration failed."
            );

        }

    }

    catch (error) {

        showMessage(
            "Cannot connect to server."
        );

        console.error(error);

    }
}


// =====================================================
// GET CURRENT USER ID
// =====================================================

function getUserId() {

    const userId =
        localStorage.getItem("user_id");

    if (userId) {

        return parseInt(userId);

    }


    const user =
        localStorage.getItem("mindcare_user");

    if (user) {

        try {

            const userData =
                JSON.parse(user);

            return userData.id;

        }

        catch (error) {

            return null;

        }

    }

    return null;
}


// =====================================================
// GET USER DATA
// =====================================================

async function getUser() {

    const userId =
        getUserId();

    if (!userId) {

        return null;

    }


    try {

        const result =
            await apiRequest(
                "/user/" + userId,
                "GET"
            );


        if (result.success) {

            localStorage.setItem(
                "mindcare_user",
                JSON.stringify(result.user)
            );

            return result.user;

        }

        return null;

    }

    catch (error) {

        console.error(error);

        return null;

    }
}


// =====================================================
// LOAD USER DATA
// =====================================================

async function loadUserData() {

    const user =
        await getUser();

    if (!user) {

        return;

    }


    // Common element IDs

    setElementValue(
        "userName",
        user.name
    );

    setElementValue(
        "name",
        user.name
    );

    setElementValue(
        "age",
        user.age
    );

    setElementValue(
        "gender",
        user.gender
    );

    setElementValue(
        "location",
        user.location
    );

    setElementValue(
        "favoriteSport",
        user.favorite_sport
    );

    setElementValue(
        "favoriteMovie",
        user.favorite_movie
    );

    setElementValue(
        "favoriteAnime",
        user.favorite_anime
    );

    setElementValue(
        "favoriteMusic",
        user.favorite_music
    );

    setElementValue(
        "favoriteFood",
        user.favorite_food
    );

    setElementValue(
        "hobbies",
        user.hobbies
    );


    setElementText(
        "gamesCompleted",
        user.games_completed
    );

    setElementText(
        "memoryScore",
        user.memory_score
    );

    setElementText(
        "attentionScore",
        user.attention_score
    );

    setElementText(
        "recallScore",
        user.recall_score
    );

}


// =====================================================
// SET INPUT VALUE
// =====================================================

function setElementValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value ?? "";

    }

}


// =====================================================
// SET TEXT
// =====================================================

function setElementText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value ?? "";

    }

}


// =====================================================
// UPDATE PROFILE
// =====================================================

async function updateProfile() {

    const userId =
        getUserId();

    if (!userId) {

        showMessage(
            "Please login first."
        );

        return;

    }


    const data = {

        user_id: userId,

        name:
            getValue("name"),

        age:
            getValue("age"),

        gender:
            getValue("gender"),

        location:
            getValue("location"),

        favorite_sport:
            getValue("favoriteSport"),

        favorite_movie:
            getValue("favoriteMovie"),

        favorite_anime:
            getValue("favoriteAnime"),

        favorite_music:
            getValue("favoriteMusic"),

        favorite_food:
            getValue("favoriteFood"),

        hobbies:
            getValue("hobbies")

    };


    try {

        const result =
            await apiRequest(
                "/update-profile",
                "POST",
                data
            );


        if (result.success) {

            showMessage(
                "Patient profile saved successfully.",
                true
            );

            await loadUserData();

        }

        else {

            showMessage(
                result.message ||
                "Profile update failed."
            );

        }

    }

    catch (error) {

        showMessage(
            "Cannot connect to server."
        );

    }

}


// =====================================================
// GET INPUT VALUE
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {

        return "";

    }

    return element.value.trim();

}


// =====================================================
// UPDATE MEMORY
// =====================================================

async function updateMemory(
    name,
    food,
    place,
    hobby
) {

    const userId =
        getUserId();

    if (!userId) {

        return;

    }


    try {

        const result =
            await apiRequest(
                "/update-memory",
                "POST",
                {
                    user_id: userId,
                    name: name,
                    food: food,
                    place: place,
                    hobby: hobby
                }
            );


        if (result.success) {

            console.log(
                "Memory saved successfully."
            );

        }

        else {

            console.error(
                result.message
            );

        }

    }

    catch (error) {

        console.error(
            "Memory update error:",
            error
        );

    }

}


// =====================================================
// SAVE SCORE
// =====================================================

async function updateScore(
    memory,
    attention,
    recall
) {

    const userId =
        getUserId();

    if (!userId) {

        console.error(
            "User not logged in."
        );

        return;

    }


    try {

        const result =
            await apiRequest(
                "/update-score",
                "POST",
                {
                    user_id: userId,
                    memory: memory,
                    attention: attention,
                    recall: recall
                }
            );


        if (result.success) {

            console.log(
                "Score saved successfully."
            );

        }

        else {

            console.error(
                result.message
            );

        }

    }

    catch (error) {

        console.error(
            "Score update error:",
            error
        );

    }

}


// =====================================================
// AI RECOMMENDATION
// =====================================================

async function getRecommendation(
    memory,
    attention,
    recall
) {

    const userId =
        getUserId();

    if (!userId) {

        return null;

    }


    try {

        const result =
            await apiRequest(
                "/recommend",
                "POST",
                {
                    user_id: userId,
                    memory: memory,
                    attention: attention,
                    recall: recall
                }
            );


        if (result.success) {

            displayRecommendation(
                result
            );

            return result;

        }


        return null;

    }

    catch (error) {

        console.error(
            "Recommendation error:",
            error
        );

        return null;

    }

}


// =====================================================
// DISPLAY AI RECOMMENDATION
// =====================================================

function displayRecommendation(result) {

    let activityElement =
        document.getElementById(
            "recommendation"
        );

    let reasonElement =
        document.getElementById(
            "recommendationReason"
        );


    if (activityElement) {

        activityElement.textContent =
            result.activity || "";

    }


    if (reasonElement) {

        reasonElement.textContent =
            result.reason || "";

    }

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem(
        "mindcare_user"
    );

    localStorage.removeItem(
        "user_id"
    );

    window.location.href =
        "Index.html";

}


// =====================================================
// PROTECT DASHBOARD
// =====================================================

function checkLogin() {

    const userId =
        getUserId();

    if (!userId) {

        window.location.href =
            "Index.html";

        return false;

    }

    return true;

}


// =====================================================
// BUTTON EVENT HANDLING
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "MindCare connected to:",
            API_URL
        );


        // -----------------------------
        // LOGIN BUTTON
        // -----------------------------

        const buttons =
            document.querySelectorAll(
                "button"
            );


        buttons.forEach(function (button) {

            const text =
                button.textContent
                    .trim()
                    .toLowerCase();


            if (text === "login") {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        loginUser();

                    }
                );

            }


            if (
                text === "create account" ||
                text === "register"
            ) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        window.location.href =
                            "register.html";

                    }
                );

            }


            if (
                text === "logout"
            ) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        logout();

                    }
                );

            }

        });


        // -----------------------------
        // ENTER KEY LOGIN
        // -----------------------------

        document
            .querySelectorAll(
                "input"
            )
            .forEach(function (input) {

                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter"
                        ) {

                            if (
                                input.type === "password"
                            ) {

                                loginUser();

                            }

                        }

                    }
                );

            });


        // -----------------------------
        // LOAD USER
        // -----------------------------

        if (
            getUserId()
        ) {

            loadUserData();

        }

    }
);