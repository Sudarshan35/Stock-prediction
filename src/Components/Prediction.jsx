import React, { useState } from "react";
import Navbar from './Navbar';
import { Pie, Bar } from 'react-chartjs-2';
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const LoadingSpinner = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const Prediction = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [userInput, setUserInput] = useState({
    investment_amount: 0,
    risk_tolerance: "",
    investment_period: 0,
    expected_return:0
  });
  const [graphType, setGraphType] = useState("allocation");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputsDisabled, setInputsDisabled] = useState(false); 

  const changeHandler = (e) => {
    setUserInput((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const calculateStock = async () => {
    setLoading(true);
    setErr(false);
    setInputsDisabled(true); 
    try {
      const response = await axios.post("http://localhost:8080/api/portfolio/prediction", userInput);

      if (!response) {
        console.log("An error occurred while fetching the prediction");
        setErr(true);
        setLoading(false);
        setInputsDisabled(false); 
        return;
      }

      setPredictionData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log("An error occurred while fetching the prediction", error);
      setErr(true);
      setLoading(false);
      setInputsDisabled(false); 
    }
  };

  const resetInputs = () => {
    setUserInput({
      investment_amount: 0,
      risk_tolerance: "",
      investment_period: 0,
    });
    setPredictionData(null);
    setInputsDisabled(false); 
    setErr(false);
  };

  const getPieChartData = () => {
    if (!predictionData) return {};

    const labels = predictionData.optimized_portfolio_weights_in_percentage.Optimized_Portfolio_Weights_in_Percentage.map(obj => obj.Ticker);
    const data = predictionData.optimized_portfolio_weights_in_percentage.Optimized_Portfolio_Weights_in_Percentage.map(obj => parseFloat(obj.Weight.replace('%', '')));

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384'
          ]
        }
      ]
    };
  };

  const getBarChartData = () => {
    if (!predictionData) return {};

    const labels = Array.from({ length: userInput.investment_period }, (_, i) => `${i + 1}Y`);
    const principal = parseFloat(userInput.investment_amount);
    const annualReturn = parseFloat(predictionData.optimized_portfolio_annualized_return);

    const dataInvested = [];
    const dataGains = [];

    let totalPrincipal = principal;

    for (let i = 0; i < labels.length; i++) {
      dataInvested.push(totalPrincipal);
      const compoundedValue = totalPrincipal * Math.pow(1 + annualReturn / 100, 1);
      dataGains.push(compoundedValue);
      totalPrincipal += principal;
    }

    return {
      labels,
      datasets: [
        {
          label: 'Gains',
          data: dataGains,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ],
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              font: {
                size: 14
              }
            }
          }
        }
      }
    };
  };

  return (
    <div className="">
      <Navbar />
      {loading && <LoadingSpinner />}
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-10" style={{ width: '100%', height: '1000px' }}>
        <div className="flex flex-row">
          <div className="flex-1 p-1 border-r border-gray-300 overflow-y-auto">
            <div className="flex justify-end p-4">
              <select
                name="graphType"
                onChange={(e) => setGraphType(e.target.value)}
                className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-50"
                disabled={inputsDisabled}
              >
                <option value="allocation">Allocation</option>
                <option value="return">Return</option>
              </select>
            </div>
            {predictionData ? (
              <div className="w-full h-[500px]">
                {graphType === "allocation" ? (
                  <Pie data={getPieChartData()} width={400} height={400} />
                ) : (
                  <Bar data={getBarChartData()} options={{ maintainAspectRatio: false }} width={400} height={400} />
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">{loading ? 'Fetching data...' : 'Graph will be here soon...'}</p>
              </div>
            )}
          </div>

          <div className="resultdiv flex-1 p-[150px] space-y-9">
            <div className="inputdiv flex flex-col md:flex-row md:space-x-4 mb-4">
              <div className="amount">
                <label htmlFor="principal" className="block text-lg font-medium mb-4 text-gray-700">
                  Principal
                </label>
                <input
                  type="text"
                  name="investment_amount"
                  placeholder="Enter principal amount"
                  onChange={changeHandler}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 hover:border-customGreen-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-250 px-5 py-4"
                  disabled={inputsDisabled}
                />
              </div>
              <div className="period">
                <label htmlFor="investment_period" className="block text-lg mb-4 font-medium text-gray-700">
                  Investment Period
                </label>
                <input
                  type="text"
                  name="investment_period"
                  placeholder="Enter investment period"
                  onChange={changeHandler}
                  className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm hover:border-customGreen-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-250 px-5 py-4"
                  disabled={inputsDisabled}
                />
              </div>
              <div className="risk">
                <label htmlFor="risk_tolerance" className="block text-lg mb-4 font-medium text-gray-700">
                  Risk Tolerance
                </label>
                <select
                  name="risk_tolerance"
                  onChange={changeHandler}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border-2 hover:border-customGreen-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-250 px-5 py-4"
                  disabled={inputsDisabled}
                >
                  <option value="">Select...</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={calculateStock}
                className="w-full bg-customGreen-100 text-white font-semibold py-3 px-4 rounded border-slate-600 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={inputsDisabled}
              >
                Calculate
              </button>
              <button
                onClick={resetInputs}
                className="w-full bg-gray-500 text-white font-semibold py-3 px-4 rounded border-slate-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Reset
              </button>
            </div>

            {err && <div className="text-red-500">An error occurred. Please try again.</div>}

            <div className="results mt-6">
              {!predictionData ? (
                <div className="text-gray-500"></div>
              ) : (
                <div className="maindiv space-y-6">
                  <div className="upperdiv grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="totalInvestment p-4 bg-gray-100 rounded shadow">
                      <p className="font-medium text-gray-700">Total Invested</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {userInput.investment_amount}
                      </p>
                    </div>
                    <div className="total_gains p-4 bg-gray-100 rounded shadow">
                      <p className="font-medium text-gray-700">Total Gains</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {(predictionData.investment_value_after_period).toFixed(2)}
                      </p>
                    </div>
                    <div className="future_return p-4 bg-gray-100 rounded shadow">
                      <p className="font-medium text-gray-700">Future Return</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {(predictionData.investment_value_after_period + parseFloat(userInput.investment_amount)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="lowerdiv">
                    <div className="headings grid grid-cols-5 font-medium text-gray-700 mb-2">
                      <div>Fund Name</div>
                      <div>Risk</div>
                      <div>Sharpe</div>
                      <div>Returns</div>
                      <div>Allocation Percentage</div>
                    </div>
                    <div className="data space-y-2">
                      {predictionData.annualized_return_and_risk_in_percentage.Annualized_Return_and_Risk.map(
                        (obj, index) => (
                          <div key={index} className="row grid grid-cols-5 gap-4 p-2 bg-white rounded shadow">
                            <div className="stock">{obj.Ticker}</div>
                            <div className="risk">{obj.Risk}</div>
                            <div className="sharpe">{obj.Sharpe}</div>
                            <div className="return">{obj.Return}</div>
                            <div className="weight">
                              {
                                predictionData.optimized_portfolio_weights_in_percentage
                                  .Optimized_Portfolio_Weights_in_Percentage.find(
                                    (weightObj) => weightObj.Ticker === obj.Ticker
                                  )?.Weight || "N/A"
                              }
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
