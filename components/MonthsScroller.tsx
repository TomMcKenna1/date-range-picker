import MonthPicker from "./MonthPicker";
import "./MonthsScroller.css";

interface MonthsScrollerProps {
  startDate: Date,
  selection: Array<null | Date>,
  onSelection: Function,
  preloadMonths?: number,
}

const MonthsScroller = (props: MonthsScrollerProps) => {
  const { startDate, selection, onSelection, preloadMonths = 4 } = props;

  return (
    <div className="date-range-picker">
      {Array.from(Array(preloadMonths)).map((_x, i) => (
        <MonthPicker
          key={i}
          value={new Date(startDate.getFullYear(), startDate.getMonth() + i)}
          selection={selection}
          onSelection={onSelection}
        />
      ))}
    </div>
  )
}

export default MonthsScroller