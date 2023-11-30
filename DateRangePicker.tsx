import Button from '@mui/material/Button';
import MonthsScroller from "./components/MonthsScroller";
import "./DateRangePicker.css";

interface DateRangePickerProps {
  onNext: Function,
  onSelectionChange: Function,
  selection?: Array<null | Date>,
  startDate?: Date,
  preloadMonths?: number,
}

const DateRangePicker = (props: DateRangePickerProps) => {
  const {
    onNext,
    onSelectionChange,
    selection = [null, null],
    startDate = new Date(),
    preloadMonths = 4
  } = props;

  function isCloser(baseDate: Date, queryDate: Date, compareToDate: Date) {
    const queryDifference = Math.abs(queryDate.getTime() - baseDate.getTime());
    const baseDifference = Math.abs(compareToDate.getTime() - baseDate.getTime());
    if (queryDifference < baseDifference) {
      return true;
    }
    return false;
  }

  function editSelected(newSelection: Date) {
    let newRange = [...selection];
    const selectedStart = selection[0];
    const selectedEnd = selection[1];
    if (newSelection.getDate() === selectedEnd?.getDate()) {
      newRange[1] = null;
    }
    else if (newSelection.getDate() === selectedStart?.getDate()) {
      newRange[0] = null;
      newRange[1] = null;
    }
    else if (
      !selectedStart ||
      newSelection < selectedStart ||
      (selectedEnd && isCloser(newSelection, selectedStart, selectedEnd))
    ) {
      newRange[0] = newSelection;
    }
    else {
      newRange[1] = newSelection;
    }
    onSelectionChange(newRange);
  }

  return (<>
    <div className='days-header'>
      <div className='days-header__day'>Mon</div>
      <div className='days-header__day'>Tue</div>
      <div className='days-header__day'>Wed</div>
      <div className='days-header__day'>Thu</div>
      <div className='days-header__day'>Fri</div>
      <div className='days-header__day'>Sat</div>
      <div className='days-header__day'>Sun</div>
    </div>
    <MonthsScroller
      startDate={startDate}
      selection={selection}
      onSelection={editSelected}
      preloadMonths={preloadMonths}
    />
    <div className='button-container'>
      <Button
        onClick={(event) => onNext(event)}
        variant='contained'
        className='next-button'
      >
        Next
      </Button>
    </div>
  </>);
}

export default DateRangePicker