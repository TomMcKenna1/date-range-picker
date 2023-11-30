import DayButton from "./DayButton";
import './DayPicker.css';

interface daysPickerProps {
  value: Date,
  indent: number,
  numDays: number,
  selection: Array<null | Date>,
  onSelection: React.MouseEventHandler<HTMLButtonElement>
}

const DayPicker = (props: daysPickerProps) => {
  const { value, indent, numDays, selection, onSelection } = props;
  let days: Array<JSX.Element> = [];
  const selectedStart = selection[0];
  const selectedEnd = selection[1];

  function generateDayButtonClassname(dayButtonDate: Date): string {
    let classname = "days-container__day";
    if (!selectedStart || !selectedEnd) {
      return classname;
    }
    else if (dayButtonDate.getTime() === selectedStart.getTime()) {
      classname += " days-container__day--first"
    }
    else if (dayButtonDate.getTime() === selectedEnd.getTime()) {
      classname += " days-container__day--last"
    }
    else if (dayButtonDate > selectedStart && dayButtonDate < selectedEnd) {
      classname += " days-container__day--inbetween"
    }
    return classname;
  }

  function initiateDays() {
    const firstDate = new Date(value.getFullYear(), value.getMonth(), 1);
    const lastDate = new Date(value.getFullYear(), value.getMonth(), numDays);
    for (let i = 0; i < indent; i++) {
      days.push(
        <div
          className={
            i === indent - 1 &&
              selectedStart &&
              selectedEnd &&
              firstDate > selectedStart &&
              firstDate <= selectedEnd ?
              "days-container__indent--start" :
              ""
          }
        />
      );
    }
    for (let i = 1; i <= numDays; i++) {
      let dayButtonDate = new Date(value.getFullYear(), value.getMonth(), i);
      days.push(
        <DayButton
          active={
            selectedStart !== null && dayButtonDate.getTime() === selectedStart.getTime()
            ||
            selectedEnd !== null && dayButtonDate.getTime() === selectedEnd.getTime()
          }
          className={generateDayButtonClassname(dayButtonDate)}
          onClick={onSelection}
        >
          {i}
        </DayButton>
      )
    }
    if ((indent + numDays) % 7 !== 0) {
      days.push(
        <div
          className={
            selectedStart &&
              selectedEnd &&
              lastDate >= selectedStart &&
              lastDate < selectedEnd ?
              "days-container__indent--end" :
              ""
          }
        />
      );
    }
  }

  initiateDays();
  return (
    <ul className="days-container">
      {days.map((day, i) => <li key={i}>{day}</li>)}
    </ul>
  )
}

export default DayPicker;