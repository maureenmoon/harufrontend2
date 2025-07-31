import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const NutritionBalanceChart = ({ period }) => {
  // 임시 데이터 (나중에 API로 대체)
  const data = [
    { nutrient: "탄수화물", amount: 54.0, unit: "g", percentage: 80 },
    { nutrient: "단백질", amount: 16.0, unit: "g", percentage: 50 },
    { nutrient: "지방", amount: 10.0, unit: "g", percentage: 40 },
    { nutrient: "나트륨", amount: 689.0, unit: "mg", percentage: 30 },
    { nutrient: "콜레스테롤", amount: 74.0, unit: "mg", percentage: 47 },
  ];

  const radarData = data.map((item) => ({
    subject: item.nutrient,
    value: Math.min(item.percentage, 100), // 100%를 넘어가는 경우 100%로 제한
    fullMark: 100,
  }));

  return (
    <div className="w-full">
      {/* 레이더 차트 */}
      <div className="h-[250px] ">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <Radar
              name="영양소 균형"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 영양소 막대 그래프 */}
      <div className="h-[300px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis dataKey="nutrient" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            />
            <Bar
              dataKey="percentage"
              fill="#8884d8"
              label={{
                position: "top",
                formatter: (value) => `${value}%`,
                fill: "#666",
                fontSize: 12,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 영양소 수치 표 */}
      <div className="w-full">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              {data.map((item, index) => (
                <th
                  key={index}
                  className="py-4 px-4 text-gray-600 font-normal text-sm"
                >
                  {item.nutrient}({item.unit})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {data.map((item, index) => (
                <td key={index} className="py-3 px-4 text-gray-800">
                  {item.amount}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NutritionBalanceChart;
