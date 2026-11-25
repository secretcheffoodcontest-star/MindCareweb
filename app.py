from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from sklearn.tree import DecisionTreeClassifier
import sqlite3
import hashlib
import os

app = Flask(__name__)
CORS(app)

DATABASE = "database.db"


# =========================
# DATABASE
# =========================

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():

    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,

            name TEXT DEFAULT '',
            age INTEGER DEFAULT 0,
            gender TEXT DEFAULT '',
            location TEXT DEFAULT '',

            favorite_sport TEXT DEFAULT '',
            favorite_movie TEXT DEFAULT '',
            favorite_anime TEXT DEFAULT '',
            favorite_music TEXT DEFAULT '',
            favorite_food TEXT DEFAULT '',
            hobbies TEXT DEFAULT '',

            games_completed INTEGER DEFAULT 0,
            memory_score INTEGER DEFAULT 0,
            attention_score INTEGER DEFAULT 0,
            recall_score INTEGER DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()


# =========================
# PASSWORD
# =========================

def hash_password(password):
    return hashlib.sha256(
        password.encode()
    ).hexdigest()


# =========================
# AI MODEL
# =========================

X = [
    [90, 40, 70],
    [80, 50, 60],
    [40, 90, 70],
    [50, 80, 60],
    [60, 50, 90],
    [70, 40, 95],
    [30, 90, 40],
    [45, 85, 50]
]

y = [
    0, 0,
    1, 1,
    2, 2,
    1, 1
]

model = DecisionTreeClassifier(
    random_state=42
)

model.fit(X, y)


# =========================
# SERVE FRONTEND
# =========================

@app.route("/")
def home():

    return send_from_directory(
        os.path.dirname(
            os.path.abspath(__file__)
        ),
        "Index.html"
    )


@app.route("/style.css")
def style_css():

    return send_from_directory(
        os.path.dirname(
            os.path.abspath(__file__)
        ),
        "Style.css"
    )


@app.route("/script.js")
def script_js():

    return send_from_directory(
        os.path.dirname(
            os.path.abspath(__file__)
        ),
        "script.js"
    )


# =========================
# REGISTER
# =========================

@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    username = data.get(
        "username", ""
    ).strip()

    password = data.get(
        "password", ""
    ).strip()

    name = data.get(
        "name", ""
    ).strip()

    if (
        username == ""
        or password == ""
        or name == ""
    ):

        return jsonify({
            "success": False,
            "message": "Please fill all required fields."
        }), 400

    if len(password) < 4:

        return jsonify({
            "success": False,
            "message": "Password must contain at least 4 characters."
        }), 400

    password_hash = hash_password(password)

    try:

        conn = get_db()

        conn.execute("""
            INSERT INTO users
            (
                username,
                password,
                name
            )
            VALUES (?, ?, ?)
        """, (
            username,
            password_hash,
            name
        ))

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Registration successful."
        })

    except sqlite3.IntegrityError:

        return jsonify({
            "success": False,
            "message": "Username already exists."
        }), 400


# =========================
# LOGIN
# =========================

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    username = data.get(
        "username", ""
    ).strip()

    password = data.get(
        "password", ""
    ).strip()

    if (
        username == ""
        or password == ""
    ):

        return jsonify({
            "success": False,
            "message": "Please enter username and password."
        }), 400

    password_hash = hash_password(password)

    conn = get_db()

    user = conn.execute("""
        SELECT *
        FROM users
        WHERE username = ?
        AND password = ?
    """, (
        username,
        password_hash
    )).fetchone()

    conn.close()

    if user is None:

        return jsonify({
            "success": False,
            "message": "Invalid username or password."
        }), 401

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "user": dict(user)
    })


# =========================
# GET USER
# =========================

@app.route(
    "/user/<int:user_id>",
    methods=["GET"]
)
def get_user(user_id):

    conn = get_db()

    user = conn.execute("""
        SELECT *
        FROM users
        WHERE id = ?
    """, (
        user_id,
    )).fetchone()

    conn.close()

    if user is None:

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "user": dict(user)
    })


# =========================
# UPDATE PROFILE
# =========================

@app.route(
    "/update-profile",
    methods=["POST"]
)
def update_profile():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    user_id = data.get("user_id")

    try:
        age = int(data.get("age", 0))
    except:
        age = 0

    name = data.get(
        "name", ""
    ).strip()

    gender = data.get(
        "gender", ""
    ).strip()

    location = data.get(
        "location", ""
    ).strip()

    favorite_sport = data.get(
        "favorite_sport", ""
    ).strip()

    favorite_movie = data.get(
        "favorite_movie", ""
    ).strip()

    favorite_anime = data.get(
        "favorite_anime", ""
    ).strip()

    favorite_music = data.get(
        "favorite_music", ""
    ).strip()

    favorite_food = data.get(
        "favorite_food", ""
    ).strip()

    hobbies = data.get(
        "hobbies", ""
    ).strip()

    conn = get_db()

    conn.execute("""
        UPDATE users
        SET
            name = ?,
            age = ?,
            gender = ?,
            location = ?,
            favorite_sport = ?,
            favorite_movie = ?,
            favorite_anime = ?,
            favorite_music = ?,
            favorite_food = ?,
            hobbies = ?
        WHERE id = ?
    """, (
        name,
        age,
        gender,
        location,
        favorite_sport,
        favorite_movie,
        favorite_anime,
        favorite_music,
        favorite_food,
        hobbies,
        user_id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Patient profile saved successfully."
    })


# =========================
# UPDATE MEMORY
# =========================

@app.route(
    "/update-memory",
    methods=["POST"]
)
def update_memory():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    user_id = data.get("user_id")

    name = data.get(
        "name", ""
    )

    food = data.get(
        "food", ""
    )

    place = data.get(
        "place", ""
    )

    hobby = data.get(
        "hobby", ""
    )

    conn = get_db()

    conn.execute("""
        UPDATE users
        SET
            name = ?,
            favorite_food = ?,
            location = ?,
            hobbies = ?
        WHERE id = ?
    """, (
        name,
        food,
        place,
        hobby,
        user_id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Memory saved successfully."
    })


# =========================
# UPDATE SCORE
# =========================

@app.route(
    "/update-score",
    methods=["POST"]
)
def update_score():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    user_id = data.get("user_id")

    try:
        memory = int(data.get("memory", 0))
    except:
        memory = 0

    try:
        attention = int(data.get("attention", 0))
    except:
        attention = 0

    try:
        recall = int(data.get("recall", 0))
    except:
        recall = 0

    conn = get_db()

    user = conn.execute("""
        SELECT *
        FROM users
        WHERE id = ?
    """, (
        user_id,
    )).fetchone()

    if user is None:

        conn.close()

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    old_memory = user["memory_score"]
    old_attention = user["attention_score"]
    old_recall = user["recall_score"]

    new_memory = (
        memory if memory > 0 else old_memory
    )

    new_attention = (
        attention if attention > 0 else old_attention
    )

    new_recall = (
        recall if recall > 0 else old_recall
    )

    conn.execute("""
        UPDATE users
        SET
            games_completed =
                games_completed + 1,

            memory_score = ?,
            attention_score = ?,
            recall_score = ?

        WHERE id = ?
    """, (
        new_memory,
        new_attention,
        new_recall,
        user_id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Score saved successfully."
    })


# =========================
# AI RECOMMENDATION
# =========================

@app.route(
    "/recommend",
    methods=["POST"]
)
def recommend():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    user_id = data.get("user_id")

    try:
        memory = int(data.get("memory", 0))
    except:
        memory = 0

    try:
        attention = int(data.get("attention", 0))
    except:
        attention = 0

    try:
        recall = int(data.get("recall", 0))
    except:
        recall = 0

    conn = get_db()

    user = conn.execute("""
        SELECT *
        FROM users
        WHERE id = ?
    """, (
        user_id,
    )).fetchone()

    conn.close()

    if user is None:

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    prediction = model.predict([
        [
            memory,
            attention,
            recall
        ]
    ])[0]

    sport = user["favorite_sport"]
    movie = user["favorite_movie"]
    anime = user["favorite_anime"]
    music = user["favorite_music"]
    food = user["favorite_food"]
    hobbies = user["hobbies"]

    if sport != "":

        if "cricket" in sport.lower():

            activity = "🏏 Cricket Memory Challenge"

            reason = (
                "This activity combines memory practice "
                "with the patient's interest in cricket."
            )

        elif "football" in sport.lower():

            activity = "⚽ Football Memory Challenge"

            reason = (
                "This activity uses football-related "
                "content to make cognitive practice more engaging."
            )

        else:

            activity = (
                "🏆 "
                + sport
                + " Memory Challenge"
            )

            reason = (
                "This activity is personalized using "
                "the patient's favorite sport."
            )

    elif anime != "":

        activity = "🍥 Anime Character Memory"

        reason = (
            "This activity uses anime-related content "
            "based on the patient's interests."
        )

    elif movie != "":

        activity = "🎬 Movie Memory Challenge"

        reason = (
            "This activity uses movie-related content "
            "to make cognitive practice familiar."
        )

    elif music != "":

        activity = "🎵 Music Memory Challenge"

        reason = (
            "This activity uses music-related content "
            "based on the patient's interests."
        )

    elif food != "":

        activity = "🍎 Food Memory Challenge"

        reason = (
            "This activity uses familiar food-related "
            "content for memory practice."
        )

    elif hobbies != "":

        activity = (
            "🎯 "
            + hobbies
            + " Memory Challenge"
        )

        reason = (
            "This activity is personalized according "
            "to the patient's hobby."
        )

    else:

        if prediction == 0:

            activity = "🧠 Memory Game"

            reason = (
                "Memory performance can be supported "
                "with recall activities."
            )

        elif prediction == 1:

            activity = "🔢 Number Sequence"

            reason = (
                "Attention performance can be supported "
                "with sequence activities."
            )

        else:

            activity = "🧩 Memory Recall"

            reason = (
                "Recall activities are recommended "
                "based on current performance."
            )

    return jsonify({
        "success": True,
        "activity": activity,
        "reason": reason
    })


# =========================
# START SERVER
# =========================

if __name__ == "__main__":

    init_db()

    print("")
    print("==============================")
    print("       MINDCARE SERVER")
    print("==============================")
    print("")
    print("Open on this computer:")
    print("http://127.0.0.1:5000")
    print("")
    print("Server running...")
    print("")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )