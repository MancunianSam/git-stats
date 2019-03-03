import * as React from "react";
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area
} from "recharts";

interface IAreaChartProps {
  data: {}[];
  name: string;
  key1: string;
  key2?: string;
}

export const StatsAreaChart: React.SFC<IAreaChartProps> = props => {
  return (
    <AreaChart
      width={600}
      height={400}
      data={props.data}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={props.name} />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey={props.key1}
        stackId="1"
        stroke="#fff"
        fill="hsl(217, 94%, 31%)"
      />
      {props.key2 && (
        <Area
          type="monotone"
          dataKey={props.key2}
          stackId="1"
          stroke="#fff"
          fill="hsl(217, 77%, 78%)"
        />
      )}
    </AreaChart>
  );
};
