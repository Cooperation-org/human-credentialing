import { useCallback, useState, useEffect } from "react";
import "./style.css";
import axios from "axios";

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const FiverrPage = (props) => {
  const { userAccount } = props;

  const [isRequestingMagicLink, setIsRequestingMagicLink] = useState(false);
  const [isRequestingFiverrLink, setIsRequestingFiverrLink] = useState(false);
  const [magicLink, setMagicLink] = useState();
  const [textCopy, setTextCopy] = useState("Copy");
  const [result, setResult] = useState();

  const copyLink = useCallback(() => {
    // Get the text field
    var copyText = document.getElementById("magicLink");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    setTextCopy("Copied");

    setTimeout(() => {
      setTextCopy("Copy");
    }, 3000);
  }, []);

  useEffect(() => {
    const getFiverrProfileURL = `${BACKEND_BASE_URL}/fiverr-profile/${userAccount}`;
    setIsRequestingFiverrLink(true);
    axios
      .get(getFiverrProfileURL)
      .then((res) => {
        setResult(res.data.message);
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        setIsRequestingFiverrLink(false);
      });
  }, []);

  const getLink = useCallback(() => {
    if (userAccount) {
      setIsRequestingMagicLink(true);
      const getFiverrMagicLink = `${BACKEND_BASE_URL}/get-fiverr-magic-link?userAccount=${userAccount}`;
      axios
        .get(getFiverrMagicLink)
        .then((res) => {
          setMagicLink(res.data.magicToken);
        })
        .catch((err) => {
          console.error(err.message);
        })
        .finally(() => {
          setIsRequestingMagicLink(false);
        });
    }
  }, [userAccount]);

  const sendLink = useCallback((e) => {
    e.preventDefault();
    setIsRequestingFiverrLink(true);
    var url = document.getElementById("fiverrLink").value;
    const sendFiverrLink = `${BACKEND_BASE_URL}/fiverr-profile/`;
    axios
      .post(sendFiverrLink, { url, userAccount })
      .then((res) => {
        setResult(res.data.message);
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        setIsRequestingFiverrLink(false);
      });
  }, []);

  return (
    <div>
      {userAccount && (
        <>
          <p className="text">Get a token</p>
          <button
            disabled={isRequestingMagicLink}
            onClick={getLink}
            className="btn"
          >
            <span className="text__wrapper">
              {isRequestingMagicLink ? "Loading..." : "Get a token"}
            </span>
          </button>

          <p className="text">
            Copy and paste this token into your Fiverr profile's description
            section. Keep it until we are done getting your fiverr ratings and
            info. Token valid for 15 minutes only.
          </p>
          <div>
            <input id="magicLink" value={magicLink} readOnly />
            <button
              className="btn-right"
              onClick={copyLink}
              disabled={!magicLink}
            >
              {textCopy}
            </button>
          </div>
          <p className="text">
            Then share your public profile url in the below box and confirm
          </p>
          <form onSubmit={sendLink}>
            <input
              pattern="^https://www.fiverr.com/(.*)$"
              placeholder="https://www.fiverr.com/chirag8838"
              id="fiverrLink"
            />
            <button
              className="btn-right"
              type="submit"
              disabled={isRequestingFiverrLink}
            >
              {isRequestingFiverrLink ? "Loading..." : "Confirm"}
            </button>
          </form>
        </>
      )}
      {result && <pre>{JSON.stringify(result, undefined, 2)}</pre>}
    </div>
  );
};

export default FiverrPage;
