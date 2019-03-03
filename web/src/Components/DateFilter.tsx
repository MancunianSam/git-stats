import * as React from "react";
import ReactDatePicker from "react-datepicker";

interface IDateFilterProps {
  repositoryId: number;
  onSelectedChange: (selectedValue: string) => void;
}

export const DateFilter: React.FunctionComponent<IDateFilterProps> = (
  props: IDateFilterProps
) => {
  const [startDate, setStartDate]: [
    Date,
    React.Dispatch<Date>
  ] = React.useState<Date>(new Date());

  const [endDate, setEndDate]: [Date, React.Dispatch<Date>] = React.useState<
    Date
  >(new Date());

  const onChangeStart: (date: Date) => void = date => {
    setStartDate(date);
    props.onSelectedChange(`${date.toISOString()}-${endDate.toISOString()}`);
  };

  const onChangeEnd: (date: Date) => void = date => {
    setEndDate(date);
    props.onSelectedChange(`${startDate.toISOString()}-${date.toDateString()}`);
  };

  return (
    <div>
      <ReactDatePicker onChange={onChangeStart} startDate={startDate} />
      <ReactDatePicker onChange={onChangeEnd} startDate={endDate} />
    </div>
  );
};
