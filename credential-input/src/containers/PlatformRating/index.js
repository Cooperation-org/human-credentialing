import { useState, useCallback } from "react";
import "./style.css";
import axios from "axios";

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

function PlatformRating() {
  const [platform, setPlatform] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [textCopy, setTextCopy] = useState("Copy");
  const [isRequestingApiKey, setIsRequestingApiKey] = useState(false);

  const [apiKeyHeader, setApiKeyHeader] = useState("");
  const [username, setUsername] = useState("");
  const [userid, setUserid] = useState("");
  const [rating, setRating] = useState("");

  const [platformRating, setPlatformRating] = useState("");

  const getApiKey = useCallback(() => {
    setIsRequestingApiKey(true);

    const GET_API_KEY_URL = `${BACKEND_BASE_URL}/api-key?platform=${platform}`;
    axios
      .get(GET_API_KEY_URL)
      .then((res) => {
        setApiKey(res.data.apiKey);
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        setIsRequestingApiKey(false);
      });
  }, [platform]);

  const copyLink = useCallback((e) => {
    e.preventDefault();

    var copyText = document.getElementById("apiKey");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    navigator.clipboard.writeText(copyText.value);

    setTextCopy("Copied");

    setTimeout(() => {
      setTextCopy("Copy");
    }, 3000);
  }, []);

  const handlePlatformNameInput = (event) => {
    setPlatform(event.currentTarget.value);
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    const POST_RATING_URL = `${BACKEND_BASE_URL}/platform-rating`;
    if (!apiKeyHeader || !username || !userid || !rating) {
      alert("apiKeyHeader, userName, userId, rating are all required fields");
      return;
    }
    axios
      .post(
        POST_RATING_URL,
        { userName: username, userId: userid, rating: Number(rating) },
        { headers: { "x-api-key": apiKeyHeader } }
      )
      .then((res) => {
        setPlatformRating(res.data.message);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <p className="text">Fetch an API key</p>
      <form>
        <div>
          <label
            htmlFor="platformName"
            style={{ display: "block" }}
            className="text"
          >
            Platform name:
          </label>
          <input
            value={platform}
            placeholder="Upwork"
            id="platformName"
            onChange={(e) => {
              handlePlatformNameInput(e);
            }}
          />
          <button
            className="btn-right"
            type="submit"
            disabled={isRequestingApiKey}
            onClick={() => getApiKey()}
          >
            Get
          </button>
        </div>
        <div>
          <input id="apiKey" value={apiKey} readOnly />
          <button
            className="btn-right"
            onClick={(e) => copyLink(e)}
            disabled={!apiKey}
          >
            {textCopy}
          </button>
        </div>
      </form>
      <p className="text">Direct update of reviews</p>
      <form>
        <div>
          <label
            style={{ display: "block" }}
            htmlFor="apiKeyHeader"
            className="text"
          >
            API KEY HEADER:
          </label>
          <input
            value={apiKeyHeader}
            id="apiKeyHeader"
            onChange={(e) => {
              setApiKeyHeader(e.currentTarget.value);
            }}
          />
        </div>
        <div>
          <label
            style={{ display: "block" }}
            htmlFor="username"
            className="text"
          >
            userName:
          </label>
          <input
            value={username}
            id="username"
            onChange={(e) => {
              setUsername(e.currentTarget.value);
            }}
          />
        </div>
        <div>
          <label style={{ display: "block" }} htmlFor="userid" className="text">
            userId:
          </label>
          <input
            value={userid}
            id="userid"
            onChange={(e) => {
              setUserid(e.currentTarget.value);
            }}
          />
        </div>
        <div>
          <label style={{ display: "block" }} htmlFor="rating" className="text">
            rating:
          </label>
          <input
            value={rating}
            id="rating"
            onChange={(e) => {
              setRating(e.currentTarget.value);
            }}
          />
        </div>
        <div>
          <button
            style={{ marginTop: "10px" }}
            onClick={(e) => handleRatingSubmit(e)}
          >
            Submit
          </button>
        </div>
      </form>
      {platformRating && (
        <pre>{JSON.stringify(platformRating, undefined, 2)}</pre>
      )}
    </div>
  );
}

export default PlatformRating;
