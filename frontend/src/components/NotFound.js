import { Link } from "react-router-dom";

const notFound = () => {
  return (
    <div>
      <p class="notFound">404 - Page Not Found</p>
      <Link class="backToHome" to="/">
        Back to home page...
      </Link>
    </div>
  );
};

export default notFound;
