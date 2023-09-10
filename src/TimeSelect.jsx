import React, { useState } from 'react';

export default function TimeSelect(props) {
  const [selectedTime, setSelectedTime] = useState('');

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <div className='time-select'>
     
     <select
      value={props.time}
      onChange={(e) => {
        props.setTime(parseInt(e.target.value)); // Convert value to an integer
      }}
    >
      <option value={0}>12:00 AM</option>
      <option value={1}>01:00 AM</option>
      <option value={2}>02:00 AM</option>
      <option value={3}>03:00 AM</option>
      <option value={4}>04:00 AM</option>
      <option value={5}>05:00 AM</option>
      <option value={6}>06:00 AM</option>
      <option value={7}>07:00 AM</option>
      <option value={8}>08:00 AM</option>
      <option value={9}>09:00 AM</option>
      <option value={10}>10:00 AM</option>
      <option value={11}>11:00 AM</option>
      <option value={12}>12:00 PM</option>
      <option value={13}>01:00 PM</option>
      <option value={14}>02:00 PM</option>
      <option value={15}>03:00 PM</option>
      <option value={16}>04:00 PM</option>
      <option value={17}>05:00 PM</option>
      <option value={18}>06:00 PM</option>
      <option value={19}>07:00 PM</option>
      <option value={20}>08:00 PM</option>
      <option value={21}>09:00 PM</option>
      <option value={22}>10:00 PM</option>
      <option value={23}>11:00 PM</option>
    </select>
      
    </div>
  );
};


