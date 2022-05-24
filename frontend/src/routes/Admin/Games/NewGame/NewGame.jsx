import React, {useState} from "react";

const NewGame = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [genre, setGenre] = useState("");
    const [release, setRelease] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Works")

        const game = {
            title,
            description,
            genre,
            image,
            release
        }
        
    }

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
          ></textarea>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="imageUrl"
              className="form-control"
              placeholder="Image URL"
            />
          </div>
        </div>
        <select name="genre" id="genre">
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
            />
          </div>
        </div>
        <button className="add-game-btn">Add game</button>
      </form>
    </>
  );
};

export default NewGame;
