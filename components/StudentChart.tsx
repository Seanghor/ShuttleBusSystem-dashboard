// Chart
import { UserResponse } from "@/types/user";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface StudentChartProps {
  data: any;
  options: any;
  filteredDataForChart : UserResponse[];
}

const StudentChart = ( {data, options, filteredDataForChart} : StudentChartProps) => {
  return (
    <div className="w-60" style={{ width: "280px", height: "280px" }}>
      <div className="relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col  justify-center">
            <span className="w-7 text-center">
              {filteredDataForChart.length}
            </span>
            <span className="mr-20">
              <span className="mr-4">Total</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChart;
