import "./style.css";
import { Link } from "react-router-dom";

const FiverrAuth = () => {
  return (
    <div className="button__margin">
      <Link to="/cred/fiverr" className="btn">
        <span className="text__wrapper">Add your fiverr ratings</span>
      </Link>
    </div>
  );
};

export default FiverrAuth;
