"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { getAllUserChartApi } from "@/services/users/getAllUser-api";
import { getCookie } from "cookies-next";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const token = getCookie("token");
        const res = await getAllUserChartApi({
          token: token,
        });

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllUser();
  }, []);

  const data = {
    labels: [
      `In Krr ${user.filter((u: any) => u.inKRR === true).length}`,
      `Out Krr ${user.filter((u: any) => u.inKRR !== true).length}`,
    ],
    datasets: [
      {
        data: [
          user.filter((u: any) => u.inKRR === true).length,
          user.filter((u: any) => u.inKRR !== true).length,
        ],
        backgroundColor: ["#0E6431", "#ADCAB9"],
        hoverBackgroundColor: ["#0E6431", "#ADCAB9"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        align: "center", // Align the legend items to the center
        labels: {
          boxWidth: 17,
          padding: 16,
          usePointStyle: true,
        },
      },
    },
  } as ChartOptions<"doughnut">;

  return (
    <div className="w-60" style={{ width: "280px", height: "280px" }}>
      <div className="relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col  justify-center">
            <span className="w-7 text-center">{user.length}</span>
            <span className="mr-20">
              <span className="mr-4">Total</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
