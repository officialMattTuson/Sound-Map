from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import uuid

app = Flask(__name__)
CORS(app)

GRID_NOT_FOUND_ERROR = "Grid not found"

# Ensure the data directory exists
if not os.path.exists("data"):
    os.makedirs("data")


def get_grids_file():
    return os.path.join("data", "grids.json")


def load_grids():
    try:
        with open(get_grids_file(), "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_grids(grids):
    with open(get_grids_file(), "w", encoding="utf-8") as f:
        json.dump(grids, f, indent=4)  # Pretty-print JSON


@app.route("/grids", methods=["GET"])
def get_grids():
    return jsonify(load_grids())


@app.route("/grids", methods=["POST"])
def create_grid():
    try:
        data = request.json
        if not data or "name" not in data or "grid" not in data:
            return jsonify({"error": "Invalid data"}), 400

        grids = load_grids()
        new_grid = {
            "id": str(uuid.uuid4()),
            "name": data["name"],
            "grid": data["grid"],
        }
        grids.append(new_grid)
        save_grids(grids)
        return jsonify(new_grid), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/grids/<grid_id>", methods=["GET"])
def get_grid(grid_id):
    grids = load_grids()
    return jsonify({"error": GRID_NOT_FOUND_ERROR}), 404
    if grid is None:
        return jsonify({"error": "Grid not found"}), 404
    return jsonify(grid)


@app.route("/grids/<grid_id>", methods=["PUT"])
def update_grid(grid_id):
    try:
        data = request.json
        if not data or "name" not in data or "grid" not in data:
            return jsonify({"error": "Invalid data"}), 400

        grids = load_grids()
        for grid in grids:
            if grid["id"] == grid_id:
                grid["name"] = data["name"]
                grid["grid"] = data["grid"]
                save_grids(grids)
                return jsonify(grid)

        return jsonify({"error": "Grid not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/grids/<grid_id>", methods=["DELETE"])
def delete_grid(grid_id):
    grids = load_grids()
    initial_length = len(grids)
    grids = [g for g in grids if g["id"] != grid_id]

    if len(grids) == initial_length:
        return jsonify({"error": "Grid not found"}), 404

    save_grids(grids)
    return "", 204


if __name__ == "__main__":
    app.run(debug=True)
