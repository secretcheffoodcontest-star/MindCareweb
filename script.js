// =====================================================
// MINDCARE
// =====================================================

// YOUR LIVE RENDER BACKEND
const API_URL =
    "https://mindcareweb-f2qa.onrender.com";


// =====================================================
// API REQUEST
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

            options.body =
                JSON.stringify(data);

        }


        const response =
            await fetch(
                API_URL + endpoint,
                options
            );


        let result;

        try {

            result =
                await response.json();

        }

        catch (error) {

            throw new Error(
                "Server returned an invalid response."
            );

        }


        return result;

    }

    catch (error) {

        console.error(
            "Connection error:",
            error
        );

        throw error;

    }
}



// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

    document.getElementById(
        "loginSection"
    ).style.display = "block";


    document.getElementById(
        "registerSection"
    ).style.display = "none";


    clearMessages();

}



// =====================================================
// SHOW REGISTER
// =====================================================

function showRegister() {

    document.getElementById(
        "loginSection"
    ).style.display = "none";


    document.getElementById(
        "registerSection"
    ).style.display = "block";


    clearMessages();

}



// =====================================================
// CLEAR MESSAGES
// =====================================================

function clearMessages() {

    document.getElementById(
        "loginMessage"
    ).textContent = "";


    document.getElementById(
        "registerMessage"
    ).textContent = "";

}



// =====================================================
// LOGIN
// =====================================================

async function loginUser() {

    const username =
        document.getElementById(
            "loginUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        ).value.trim();


    const message =
        document.getElementById(
            "loginMessage"
        );


    // Check empty fields

    if (
        username === "" ||
        password === ""
    ) {

        message.textContent =
            "Please enter username and password.";

        message.style.color = "red";

        return;

    }


    message.textContent =
        "Connecting to server...";

    message.style.color =
        "#1d6fa5";


    try {

        const result =
            await apiRequest(
                "/login",
                "POST",
                {
                    username: username,
                    password: password
                }
            );


        // LOGIN SUCCESS

        if (result.success) {

            localStorage.setItem(
                "mindcare_user",
                JSON.stringify(
                    result.user
                )
            );


            localStorage.setItem(
                "user_id",
                result.user.id
            );


            message.textContent =
                "Login successful!";

            message.style.color =
                "green";


            /*
             * If you already have dashboard.html,
             * uncomment the next line.
             */

            window.location.href =
                "dashboard.html";

        }


        // LOGIN FAILED

        else {

            message.textContent =
                result.message ||
                "Invalid username or password.";

            message.style.color =
                "red";

        }

    }

    catch (error) {

        console.error(error);

        message.textContent =
            "Cannot connect to server.";

        message.style.color =
            "red";

    }

}



// =====================================================
// REGISTER
// =====================================================

async function registerUser() {

    const name =
        document.getElementById(
            "registerName"
        ).value.trim();


    const username =
        document.getElementById(
            "registerUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "registerPassword"
        ).value.trim();


    const confirmPassword =
        document.getElementById(
            "registerConfirmPassword"
        ).value.trim();


    const message =
        document.getElementById(
            "registerMessage"
        );


    // =========================================
    // VALIDATION
    // =========================================

    if (
        name === "" ||
        username === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        message.textContent =
            "Please fill all fields.";

        message.style.color =
            "red";

        return;

    }


    if (password.length < 4) {

        message.textContent =
            "Password must contain at least 4 characters.";

        message.style.color =
            "red";

        return;

    }


    if (
        password !== confirmPassword
    ) {

        message.textContent =
            "Passwords do not match.";

        message.style.color =
            "red";

        return;

    }


    message.textContent =
        "Creating account...";

    message.style.color =
        "#1d6fa5";


    // =========================================
    // SEND TO FLASK
    // =========================================

    try {

        const result =
            await apiRequest(
                "/register",
                "POST",
                {
                    name: name,
                    username: username,
                    password: password
                }
            );


        // =====================================
        // SUCCESS
        // =====================================

        if (result.success) {

            message.textContent =
                "Account created successfully!";

            message.style.color =
                "green";


            // Clear fields

            document.getElementById(
                "registerName"
            ).value = "";


            document.getElementById(
                "registerUsername"
            ).value = "";


            document.getElementById(
                "registerPassword"
            ).value = "";


            document.getElementById(
                "registerConfirmPassword"
            ).value = "";


            // Go back to login

            setTimeout(
                function () {

                    showLogin();

                    document.getElementById(
                        "loginUsername"
                    ).value =
                        username;

                },
                1200
            );

        }


        // =====================================
        // REGISTRATION FAILED
        // =====================================

        else {

            message.textContent =
                result.message ||
                "Registration failed.";

            message.style.color =
                "red";

        }

    }

    catch (error) {

        console.error(error);

        message.textContent =
            "Cannot connect to server.";

        message.style.color =
            "red";

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
// GET USER ID
// =====================================================

function getUserId() {

    const id =
        localStorage.getItem(
            "user_id"
        );


    if (id) {

        return parseInt(id);

    }


    return null;

}



// =====================================================
// GET USER
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
                JSON.stringify(
                    result.user
                )
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
// UPDATE PROFILE
// =====================================================

async function updateProfile() {

    const userId =
        getUserId();


    if (!userId) {

        alert(
            "Please login first."
        );

        return;

    }


    const data = {

        user_id: userId,

        name:
            getInputValue("name"),

        age:
            getInputValue("age"),

        gender:
            getInputValue("gender"),

        location:
            getInputValue("location"),

        favorite_sport:
            getInputValue(
                "favoriteSport"
            ),

        favorite_movie:
            getInputValue(
                "favoriteMovie"
            ),

        favorite_anime:
            getInputValue(
                "favoriteAnime"
            ),

        favorite_music:
            getInputValue(
                "favoriteMusic"
            ),

        favorite_food:
            getInputValue(
                "favoriteFood"
            ),

        hobbies:
            getInputValue(
                "hobbies"
            )

    };


    try {

        const result =
            await apiRequest(
                "/update-profile",
                "POST",
                data
            );


        if (result.success) {

            alert(
                "Profile updated successfully."
            );

        }

        else {

            alert(
                result.message ||
                "Profile update failed."
            );

        }

    }

    catch (error) {

        alert(
            "Cannot connect to server."
        );

    }

}



// =====================================================
// GET INPUT VALUE
// =====================================================

function getInputValue(id) {

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

    }

    catch (error) {

        console.error(
            "Memory update error:",
            error
        );

    }

}



// =====================================================
// UPDATE SCORE
// =====================================================

async function updateScore(
    memory,
    attention,
    recall
) {

    const userId =
        getUserId();


    if (!userId) {

        return;

    }


    try {

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

            return result;

        }


        return null;

    }

    catch (error) {

        console.error(
            "AI recommendation error:",
            error
        );

        return null;

    }

}



// =====================================================
// PAGE LOADED
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "MindCare API:",
            API_URL
        );


        // =========================================
        // CREATE ACCOUNT BUTTON
        // =========================================

        const createAccountButton =
            document.getElementById(
                "createAccountButton"
            );


        if (createAccountButton) {

            createAccountButton.addEventListener(
                "click",
                function () {

                    showRegister();

                }
            );

        }



        // =========================================
        // BACK TO LOGIN
        // =========================================

        const backToLoginButton =
            document.getElementById(
                "backToLoginButton"
            );


        if (backToLoginButton) {

            backToLoginButton.addEventListener(
                "click",
                function () {

                    showLogin();

                }
            );

        }



        // =========================================
        // LOGIN
        // =========================================

        const loginButton =
            document.getElementById(
                "loginButton"
            );


        if (loginButton) {

            loginButton.addEventListener(
                "click",
                function () {

                    loginUser();

                }
            );

        }



        // =========================================
        // REGISTER
        // =========================================

        const registerButton =
            document.getElementById(
                "registerButton"
            );


        if (registerButton) {

            registerButton.addEventListener(
                "click",
                function () {

                    registerUser();

                }
            );

        }



        // =========================================
        // ENTER KEY - LOGIN
        // =========================================

        const loginPassword =
            document.getElementById(
                "loginPassword"
            );


        if (loginPassword) {

            loginPassword.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        loginUser();

                    }

                }
            );

        }



        // =========================================
        // ENTER KEY - REGISTER
        // =========================================

        const registerPassword =
            document.getElementById(
                "registerPassword"
            );


        if (registerPassword) {

            registerPassword.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        registerUser();

                    }

                }
            );

        }

    }
);