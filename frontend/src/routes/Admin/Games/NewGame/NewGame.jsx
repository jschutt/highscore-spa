import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const NewGame = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [genre, setGenre] = useState("");
    const [releaseDate, setReleaseDate] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const game = {
            title,
            description,
            genre,
            imageUrl,
            releaseDate
        }

        console.log(game)

        fetch("http://localhost:5000/api/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(game)
        }).then(resp => {
            navigate('/admin/games')
        });
    };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            name="description"
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="imageUrl"
              className="form-control"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>
        <select 
            name="genre" 
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            >
          <option value="puzzle">Puzzle</option>
          <option value="platform">Platform</option>
          <option value="shooter">Shooter</option>
        </select>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="releaseDate"
              className="form-control"
              placeholder="Release date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>
        </div>
        <button className="add-game-btn">Add game</button>
      </form>
    </>
  );
};

export default NewGame;
