import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface IBarChartProps {
  data: {}[];
  name: string;
  key1: string;
  key2?: string;
}
export const StatsBarChart: React.SFC<IBarChartProps> = props => {
  return (
    <BarChart
      width={600}
      height={300}
      data={props.data}
      margin={{ top: 40, bottom: 5 }}
    >
      <XAxis dataKey={props.name} />
      <YAxis />
      <Tooltip />
      <Bar dataKey={props.key1} fill="hsl(217, 77%, 78%)" />
      {props.key2 && <Bar dataKey={props.key2} fill="hsl(217, 94%, 31%)" />}
    </BarChart>
  );
};
