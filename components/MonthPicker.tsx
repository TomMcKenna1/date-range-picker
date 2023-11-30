import DayPicker from "./DayPicker"

interface monthPickerProps {
  value: Date,
  selection: Array<null | Date>,
  onSelection?: Function
}

const MonthPicker = (props: monthPickerProps) => {
  const { value, selection, onSelection = () => null } = props;
  const title = value.toLocaleString('en-GB', {
    month: 'short',
    year: 'numeric'
  });

  function getIndent(date: Date): number {
    const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' })
    const indentTable: { [Name: string]: number } = {
      "Mon": 0,
      "Tue": 1,
      "Wed": 2,
      "Thu": 3,
      "Fri": 4,
      "Sat": 5,
      "Sun": 6
    }
    return indentTable[dayName];
  }

  function getDaysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  return (
    <div className='month-container'>
      <div className="month-container__title">
        {title}
      </div>
      <DayPicker
        value={value}
        indent={getIndent(value)}
        numDays={getDaysInMonth(value)}
        selection={selection}
        onSelection={(event) => onSelection(
          new Date(
            value.getFullYear(),
            value.getMonth(),
            Number(event.currentTarget.innerText)
          )
        )}
      />
    </div>
  )
}