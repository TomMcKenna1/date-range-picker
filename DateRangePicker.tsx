import Button from '@mui/material/Button';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import '/DateRangePicker.css'

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

interface MonthsScrollerProps {
    startDate: Date,
    selection: Array<null| Date>,
    onSelection: Function,
    preloadMonths?: number,
}

const MonthsScroller = (props: MonthsScrollerProps) => {
  const {startDate, selection, onSelection, preloadMonths = 4} = props;

  return (
    <div className="date-range-picker">
       {Array.from(Array(preloadMonths)).map((_x, i) => (
        <Month 
          key={i}
          value={new Date(startDate.getFullYear(), startDate.getMonth()+i)} 
          selection={selection}
          onSelection = {onSelection}
        />
      ))}
    </div>
  )
}

interface monthProps {
    value: Date,
    selection: Array<null| Date>,
    onSelection?: Function
}

const Month = (props: monthProps) => {
    const {value, selection, onSelection = () => null} = props;
    const title = value.toLocaleString('en-GB', {
        month: 'short',
        year: 'numeric'
    });

    function getIndent(date: Date): number{
        const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' })
        const indentTable: {[Name: string]: number} = {
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

    function getDaysInMonth (date: Date) {
        return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
    }

    return (
        <div className='month-container'>
            <div className="month-container__title">
                {title}
            </div>
            <DaysContainer 
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

interface daysContainerProps {
    value: Date,
    indent: number,
    numDays: number,
    selection: Array<null| Date>,
    onSelection: React.MouseEventHandler<HTMLButtonElement>
}

const DaysContainer = (props: daysContainerProps) => {
    const {value, indent, numDays, selection, onSelection} = props;
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
                    i === indent-1 &&
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
        if ((indent + numDays)%7 !== 0) {
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

interface dayButtonProps extends IconButtonProps {
    active?: boolean
}

const DayButton = (props: dayButtonProps) => {
    const {active = false, className, ...others} = props;
    return (
        <div className={className}>
            <IconButton 
            className = {'days-container__day__button' + (active ? ' days-container__day__button--active' : '')}
            disableRipple
            {...others}
            >
                {props.children}
            </IconButton>
        </div>
    )
}

export default DateRangePicker;