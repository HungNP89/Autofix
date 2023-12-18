import { Calendar, theme } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';

// eslint-disable-next-line react/prop-types
function MiniCalendar({onSelectDate}) {
  const [value, setValue] = useState(() => dayjs(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);

  const onSelect = (newValue, { source }) => {
    if (source === "date") {
      setValue(newValue);
      setSelectedDate(newValue);
    }
    if (onSelectDate) {
        onSelectDate(newValue);
      }
  };

  const onPanelChange = (newValue) => {
    setValue(newValue);
  };
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  const disabledDate = (current) => {
    return  current < dayjs().startOf("day");
  };
  console.log(selectedDate)
  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onPanelChange={onPanelChange} value={value}
                onSelect={onSelect} disabledDate={disabledDate}/>
    </div>
  );
}
export default MiniCalendar;