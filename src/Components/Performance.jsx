import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import Loader from "./loader";

const Performance = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/portfolio/summary');
        setData(response.data);
      } catch (error) {
        console.log("An error occurred", error);
      }
    };

    fetchData();
  }, []);

return (
  <div className="container">
    <Navbar />
    
    <div className="table w-full mt-[80px] mx-10">
      <div className="headers grid grid-cols-10 gap-4 bg-gray-200 p-2 ">
        <div className="font-semibold">Stock Name</div>
        <div className="font-semibold">Return</div>
        <div className="font-semibold">Risk</div>
        <div className="font-semibold">SystRisk_var</div>
        <div className="font-semibold">TotalRisk_var</div>
        <div className="font-semibold">UnsystRisk_var</div>
        <div className="font-semibold">Alpha</div>
        <div className="font-semibold">Beta</div>
        <div className="font-semibold">Capm_ret</div>
        <div className="font-semibold">Sharpe Ratio</div>
      </div>

      <div className="data">
        {data ? (
          Object.keys(data).map((stock, index) => (
            <div
              key={index}
              className="row grid grid-cols-10 gap-4  shadow-md p-2 border-b border-gray-200"
            >
              <div>{stock}</div>
              <div>{data[stock].Return.toFixed(2)}</div>
              <div>{data[stock].Risk.toFixed(2)}</div>
              <div>{data[stock].SystRisk_var.toFixed(2)}</div>
              <div>{data[stock].TotalRisk_var.toFixed(2)}</div>
              <div>{data[stock].UnsystRisk_var.toFixed(2)}</div>
              <div>{data[stock].alpha.toFixed(2)}</div>
              <div>{data[stock].beta.toFixed(2)}</div>
              <div>{data[stock].capm_ret.toFixed(2)}</div>
              <div>{data[stock].sharpe.toFixed(2)}</div>
            </div>
          ))
        ) : (
          <div className="text-center p-4"><Loader/></div>
        )}
      </div>
    </div>
  </div>
);

};

export default Performance;