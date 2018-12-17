//This will be deleted when the data is coming from the server

const data: {}[] = [
  {
    name: "FunctionA",
    nloc: Math.round(Math.random() * (4000 - 1000) + 1000),
    complexity: Math.round(Math.random() * (4000 - 1000) + 1000)
  },
  {
    name: "FunctionB",
    nloc: Math.round(Math.random() * (4000 - 1000) + 1000),
    complexity: Math.round(Math.random() * (4000 - 1000) + 1000)
  },
  {
    name: "FunctionC",
    nloc: Math.round(Math.random() * (4000 - 1000) + 1000),
    complexity: Math.round(Math.random() * (4000 - 1000) + 1000)
  },
  {
    name: "FunctionD",
    nloc: Math.round(Math.random() * (4000 - 1000) + 1000),
    complexity: Math.round(Math.random() * (4000 - 1000) + 1000)
  },
  {
    name: "FunctionE",
    nloc: Math.round(Math.random() * (4000 - 1000) + 1000),
    complexity: Math.round(Math.random() * (4000 - 1000) + 1000)
  },
  {
    name: "FunctionF",
    nloc: Math.round(Math.random() * (4000 - 1000) + 1000),
    complexity: Math.round(Math.random() * (4000 - 1000) + 1000)
  },
  {
    name: "FunctionG",
    nloc: Math.round(Math.random() * (4000 - 1000) + 1000),
    complexity: Math.round(Math.random() * (4000 - 1000) + 1000)
  }
];

const pieData1: {}[] = [
  { name: "File1", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File B", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File C", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File D", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File E", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File F", value: Math.round(Math.random() * (4000 - 1000) + 1000) }
];

const pieData2 = [
  { name: "File A", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File B", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File C", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File D", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File E", value: Math.round(Math.random() * (4000 - 1000) + 1000) },
  { name: "File F", value: Math.round(Math.random() * (4000 - 1000) + 1000) }
];

export const getBarData: (repository: string) => {}[] = () => data;
export const getPie1Data: (repository: string) => {}[] = () => pieData1;
export const getPie2Data: (repository: string) => {}[] = () => pieData2;
