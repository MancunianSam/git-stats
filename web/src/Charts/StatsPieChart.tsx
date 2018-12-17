import * as React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

interface IBarChartProps {
  data1: {}[];
  data2: {}[];
}
export const StatsPieChart: React.SFC<IBarChartProps> = props => {
  return (
    <PieChart width={800} height={400} margin={{ top: 0 }}>
      <Pie
        isAnimationActive={true}
        data={props.data1}
        cx={200}
        cy={200}
        outerRadius={100}
        fill="hsl(217, 94%, 31%)"
        label
      />
      {props.data2 && (
        <Pie
          data={props.data2}
          cx={500}
          cy={200}
          innerRadius={80}
          outerRadius={100}
          fill="hsl(217, 77%, 78%)"
        />
      )}
      <Tooltip />
    </PieChart>
  );
};
