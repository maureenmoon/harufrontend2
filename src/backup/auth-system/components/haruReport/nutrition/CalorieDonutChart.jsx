import React, { useRef, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 식사 타입별 색상 정의
const MEAL_COLORS = {
  아침: "#fcd34d", // yellow-300
  점심: "#93c5fd", // blue-300
  저녁: "#fca5a5", // red-300
  간식: "#c4b5fd", // purple-300
};

const CalorieDonutChart = () => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // 임시 데이터 (나중에 API로 대체)
  const data = [
    { name: "아침", calories: 500, percentage: 25 },
    { name: "점심", calories: 700, percentage: 35 },
    { name: "저녁", calories: 600, percentage: 30 },
    { name: "간식", calories: 200, percentage: 10 },
  ];

  const totalCalories = data.reduce((sum, item) => sum + item.calories, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border rounded shadow p-2">
          <p className="font-semibold">{data.name}</p>
          <p>
            {data.calories}kcal ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        fontSize={14} // 추가: 폰트 크기
        fontWeight="semibold" // 추가: 볼드 처리
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${data[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div ref={containerRef}>
      <div className="text-center mb-4">
        <span className="text-gray-600">총 섭취 칼로리:</span>
        <span className="ml-2 font-bold text-lg">{totalCalories}kcal</span>
      </div>

      <div className="w-full h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="85%"
              fill="#8884d8"
              paddingAngle={5}
              dataKey="calories"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={MEAL_COLORS[entry.name]}
                />
              ))}
            </Pie>

            <Legend
              formatter={(value) => (
                <span style={{ color: "black" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CalorieDonutChart;
