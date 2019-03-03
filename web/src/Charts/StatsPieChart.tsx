import * as React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

interface IAreaChartProps {
  data: {}[];
  name: string;
  key1: string;
}

const colours: string[] = [
  "hsl(217, 88%, 59%)",
  "hsl(217, 45%, 84%)",
  "hsl(176, 85%, 59%)",
  "hsl(176, 87%, 27%)",
  "hsl(151, 75%, 55%)",
  "hsl(151, 96%, 29%)",
  "hsl(83, 71%, 66%)",
  "hsl(69, 62%, 52%)",
  "hsl(61, 53%, 53%)",
  "hsl(61, 89%, 35%)"
];

export const StatsPieChart: React.SFC<IAreaChartProps> = props => {
  return (
    <PieChart width={800} height={400}>
      <Tooltip />
      <Pie
        data={props.data}
        cx={300}
        cy={200}
        outerRadius={120}
        nameKey={props.name}
        dataKey={props.key1}
      >
        {props.data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colours[index]} />
        ))}
      </Pie>
    </PieChart>
  );
};
