import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentChart = ({paidPayment,pendingPayment}) => {


  const data = {
    labels: ["Receive", "Pending"],
    datasets: [
      {
        data: [paidPayment, pendingPayment],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div style={{ width: "200px" }}>
      <Pie data={data} />
    </div>
  );
};

export default PaymentChart;