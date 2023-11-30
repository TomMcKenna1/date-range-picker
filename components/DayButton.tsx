import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import '/DateRangePicker.css'

interface dayButtonProps extends IconButtonProps {
  active?: boolean
}

const DayButton = (props: dayButtonProps) => {
  const { active = false, className, ...others } = props;
  return (
    <div className={className}>
      <IconButton
        className={'days-container__day__button' + (active ? ' days-container__day__button--active' : '')}
        disableRipple
        {...others}
      >
        {props.children}
      </IconButton>
    </div>
  )
}

export default DateRangePicker;