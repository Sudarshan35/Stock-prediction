import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="nav flex w-full bg-customBlack-100 fixed top-0 h-16 justify-between text-white items-center px-6 shadow-lg">
      <div
        className="logo text-3xl font-bold font-serif cursor-pointer hover:text-customGreen-100 transition-all duration-300"
        onClick={() => navigate("/")}
      >
        Investify
      </div>
      <div className="attributes flex space-x-8">
        <div
          className="home cursor-pointer hover:text-customGreen-100 hover:scale-110 transition-transform duration-300"
          onClick={() => navigate("/")}
        >
          Home
        </div>
        <div
          className="prediction cursor-pointer hover:text-customGreen-100 hover:scale-110 transition-transform duration-300"
          onClick={() => navigate("/prediction")}
        >
          Predictions
        </div>
        <div
          className="performance cursor-pointer hover:text-customGreen-100 hover:scale-110 transition-transform duration-300"
          onClick={() => navigate("/performance")}
        >
          Performance
        </div>
      </div>
      <div className="profile cursor-pointer hover:text-customGreen-100 transition-all duration-300">
        My Account
      </div>
    </div>
  );
};

export default Navbar;
