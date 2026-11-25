"use strict";

/*
    IMPORTANT

    Keep this empty.

    When deployed online, the browser will automatically
    use the same website address for Flask.
*/

const SERVER = "";

let currentUser = null;

let memoryScore = 0;
let attentionScore = 0;
let recallScore = 0;


/* =========================
   SHOW PAGE
========================= */

function showPage(pageId) {

    const authPages =
        document.querySelectorAll(".auth-page");

    authPages.forEach(function (page) {
        page.classList.remove("active");
    });


    const pages =
        document.querySelectorAll(".page");

    pages.forEach(function (page) {
        page.classList.remove("active");
    });


    if (pageId === "login-page") {

        document
            .getElementById("login-page")
            .classList.add("active");

        document
            .getElementById("main-app")
            .classList.add("hidden");

        return;
    }


    if (pageId === "register-page") {

        document
            .getElementById("register-page")
            .classList.add("active");

        document
            .getElementById("main-app")
            .classList.add("hidden");

        return;
    }


    document
        .getElementById("main-app")
        .classList.remove("hidden");


    const selectedPage =
        document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }
}


/* =========================
   REGISTER
========================= */

async function registerUser() {

    console.log("Register button clicked");

    const name =
        document
            .getElementById("registerName")
            .value
            .trim();

    const username =
        document
            .getElementById("registerUsername")
            .value
            .trim();

    const password =
        document
            .getElementById("registerPassword")
            .value
            .trim();

    const message =
        document.getElementById(
            "registerMessage"
        );


    if (
        name === "" ||
        username === "" ||
        password === ""
    ) {

        message.textContent =
            "Please fill all fields.";

        message.style.color = "red";

        return;
    }


    if (password.length < 4) {

        message.textContent =
            "Password must contain at least 4 characters.";

        message.style.color = "red";

        return;
    }


    message.textContent =
        "Creating account...";

    message.style.color =
        "#1769aa";


    try {

        const response =
            await fetch(
                SERVER + "/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            name: name,
                            username: username,
                            password: password
                        })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            message.textContent =
                data.message ||
                "Registration failed.";

            message.style.color =
                "red";

            return;
        }


        message.textContent =
            "Account created successfully!";

        message.style.color =
            "green";


        alert(
            "Account created successfully!"
        );


        document
            .getElementById(
                "registerName"
            )
            .value = "";

        document
            .getElementById(
                "registerUsername"
            )
            .value = "";

        document
            .getElementById(
                "registerPassword"
            )
            .value = "";


        showPage("login-page");

    }

    catch (error) {

        console.error(
            "Registration error:",
            error
        );

        message.textContent =
            "Cannot connect to MindCare server.";

        message.style.color =
            "red";

        alert(
            "Cannot connect to MindCare server.\n\nMake sure app.py is running."
        );
    }
}


/* =========================
   LOGIN
========================= */

async function loginUser() {

    const username =
        document
            .getElementById(
                "loginUsername"
            )
            .value
            .trim();

    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value
            .trim();

    const message =
        document.getElementById(
            "loginMessage"
        );


    if (
        username === "" ||
        password === ""
    ) {

        message.textContent =
            "Please enter username and password.";

        message.style.color =
            "red";

        return;
    }


    message.textContent =
        "Logging in...";

    message.style.color =
        "#1769aa";


    try {

        const response =
            await fetch(
                SERVER + "/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            username:
                                username,

                            password:
                                password
                        })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            message.textContent =
                data.message ||
                "Invalid login.";

            message.style.color =
                "red";

            return;
        }


        currentUser =
            data.user;


        localStorage.setItem(
            "mindcareUserId",
            currentUser.id
        );


        message.textContent =
            "Login successful.";

        message.style.color =
            "green";


        loadUserData();

        showPage("home-page");

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );

        message.textContent =
            "Cannot connect to server.";

        message.style.color =
            "red";
    }
}


/* =========================
   LOAD USER
========================= */

async function loadUserData() {

    if (!currentUser) {
        return;
    }


    try {

        const response =
            await fetch(
                SERVER +
                "/user/" +
                currentUser.id
            );


        const data =
            await response.json();


        if (!data.success) {
            return;
        }


        currentUser =
            data.user;


        document.getElementById(
            "patientName"
        ).value =
            currentUser.name || "";


        document.getElementById(
            "patientAge"
        ).value =
            currentUser.age || "";


        document.getElementById(
            "patientGender"
        ).value =
            currentUser.gender || "";


        document.getElementById(
            "patientLocation"
        ).value =
            currentUser.location || "";


        document.getElementById(
            "favoriteSport"
        ).value =
            currentUser.favorite_sport || "";


        document.getElementById(
            "favoriteMovie"
        ).value =
            currentUser.favorite_movie || "";


        document.getElementById(
            "favoriteAnime"
        ).value =
            currentUser.favorite_anime || "";


        document.getElementById(
            "favoriteMusic"
        ).value =
            currentUser.favorite_music || "";


        document.getElementById(
            "favoriteFood"
        ).value =
            currentUser.favorite_food || "";


        document.getElementById(
            "patientHobbies"
        ).value =
            currentUser.hobbies || "";


        updateDashboard();

    }

    catch (error) {

        console.error(
            "Could not load user:",
            error
        );
    }
}


/* =========================
   SAVE PROFILE
========================= */

async function savePatientProfile() {

    if (!currentUser) {

        alert("Please login first.");

        return;
    }


    const data = {

        user_id:
            currentUser.id,

        name:
            document.getElementById(
                "patientName"
            ).value.trim(),

        age:
            document.getElementById(
                "patientAge"
            ).value,

        gender:
            document.getElementById(
                "patientGender"
            ).value,

        location:
            document.getElementById(
                "patientLocation"
            ).value.trim(),

        favorite_sport:
            document.getElementById(
                "favoriteSport"
            ).value.trim(),

        favorite_movie:
            document.getElementById(
                "favoriteMovie"
            ).value.trim(),

        favorite_anime:
            document.getElementById(
                "favoriteAnime"
            ).value.trim(),

        favorite_music:
            document.getElementById(
                "favoriteMusic"
            ).value.trim(),

        favorite_food:
            document.getElementById(
                "favoriteFood"
            ).value.trim(),

        hobbies:
            document.getElementById(
                "patientHobbies"
            ).value.trim()
    };


    try {

        const response =
            await fetch(
                SERVER +
                "/update-profile",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        const result =
            await response.json();


        const message =
            document.getElementById(
                "profileMessage"
            );


        if (result.success) {

            message.textContent =
                "Patient profile saved successfully.";

            message.style.color =
                "green";


            loadUserData();

        }

        else {

            message.textContent =
                result.message ||
                "Could not save profile.";

            message.style.color =
                "red";
        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Could not connect to server."
        );
    }
}


/* =========================
   MEMORY GAME
========================= */

function startMemoryGame() {

    showPage(
        "memory-game-page"
    );

    memoryScore = 0;

    document.getElementById(
        "memoryContent"
    ).style.display =
        "block";

    document.getElementById(
        "memoryResult"
    ).textContent =
        "";
}


function checkMemoryAnswer() {

    const result =
        document.getElementById(
            "memoryResult"
        );


    memoryScore = 80;


    result.textContent =
        "Good job! Memory activity completed.";

    result.style.color =
        "green";


    saveScore(
        memoryScore,
        0,
        0
    );
}


/* =========================
   ATTENTION GAME
========================= */

function startAttentionGame() {

    showPage(
        "attention-game-page"
    );

    document.getElementById(
        "numberAnswer"
    ).value = "";

    document.getElementById(
        "attentionResult"
    ).textContent =
        "";
}


function checkNumberAnswer() {

    const answer =
        document.getElementById(
            "numberAnswer"
        ).value.trim();

    const result =
        document.getElementById(
            "attentionResult"
        );


    if (answer === "583921") {

        attentionScore = 100;

        result.textContent =
            "Correct! Excellent attention.";

        result.style.color =
            "green";

    }

    else {

        attentionScore = 40;

        result.textContent =
            "Good attempt. Keep practicing.";

        result.style.color =
            "#d97706";
    }


    saveScore(
        0,
        attentionScore,
        0
    );
}


/* =========================
   RECALL GAME
========================= */

function startRecallGame() {

    showPage(
        "recall-game-page"
    );

    document.getElementById(
        "recallAnswer"
    ).value = "";

    document.getElementById(
        "recallResult"
    ).textContent =
        "";
}


function checkRecallAnswer() {

    const answer =
        document.getElementById(
            "recallAnswer"
        ).value.toLowerCase();


    const result =
        document.getElementById(
            "recallResult"
        );


    let score = 0;


    if (answer.includes("mango")) {
        score += 33;
    }

    if (answer.includes("school")) {
        score += 33;
    }

    if (answer.includes("cricket")) {
        score += 34;
    }


    recallScore = score;


    result.textContent =
        "Recall score: " +
        recallScore +
        "/100";


    if (recallScore >= 70) {

        result.style.color =
            "green";

    }

    else {

        result.style.color =
            "#d97706";
    }


    saveScore(
        0,
        0,
        recallScore
    );
}


/* =========================
   SAVE SCORE
========================= */

async function saveScore(
    memory,
    attention,
    recall
) {

    if (!currentUser) {
        return;
    }


    try {

        await fetch(
            SERVER +
            "/update-score",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        user_id:
                            currentUser.id,

                        memory:
                            memory,

                        attention:
                            attention,

                        recall:
                            recall
                    })
            }
        );


        loadUserData();

    }

    catch (error) {

        console.error(
            "Score saving error:",
            error
        );
    }
}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    if (!currentUser) {
        return;
    }


    document.getElementById(
        "gamesCompleted"
    ).textContent =
        currentUser.games_completed ||
        0;


    document.getElementById(
        "memoryScore"
    ).textContent =
        currentUser.memory_score ||
        0;


    document.getElementById(
        "attentionScore"
    ).textContent =
        currentUser.attention_score ||
        0;


    document.getElementById(
        "recallScore"
    ).textContent =
        currentUser.recall_score ||
        0;
}


/* =========================
   AI RECOMMENDATION
========================= */

async function getRecommendation() {

    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;
    }


    try {

        const response =
            await fetch(
                SERVER +
                "/recommend",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            user_id:
                                currentUser.id,

                            memory:
                                currentUser.memory_score ||
                                0,

                            attention:
                                currentUser.attention_score ||
                                0,

                            recall:
                                currentUser.recall_score ||
                                0
                        })
                }
            );


        const data =
            await response.json();


        if (data.success) {

            document.getElementById(
                "recommendation"
            ).innerHTML = `
                <h3>${data.activity}</h3>
                <p>${data.reason}</p>
            `;

            showPage(
                "dashboard-page"
            );

        }

    }

    catch (error) {

        console.error(
            "Recommendation error:",
            error
        );
    }
}


/* =========================
   LOGOUT
========================= */

function logoutUser() {

    currentUser = null;

    localStorage.removeItem(
        "mindcareUserId"
    );


    document.getElementById(
        "loginUsername"
    ).value = "";

    document.getElementById(
        "loginPassword"
    ).value = "";


    showPage(
        "login-page"
    );
}


/* =========================
   STARTUP
========================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const savedUserId =
            localStorage.getItem(
                "mindcareUserId"
            );


        if (savedUserId) {

            try {

                const response =
                    await fetch(
                        SERVER +
                        "/user/" +
                        savedUserId
                    );


                const data =
                    await response.json();


                if (data.success) {

                    currentUser =
                        data.user;

                    loadUserData();

                    showPage(
                        "home-page"
                    );

                    return;
                }

            }

            catch (error) {

                console.log(
                    "No active login."
                );
            }
        }


        showPage(
            "login-page"
        );
    }
);