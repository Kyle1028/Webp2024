import React, { useState } from 'react';
import {styled } from '@mui/system';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';



export default function MyDatePickers() {
  const [value, setValue] =useState(dayjs('2024-05-21'));
  const customDate = value.$y - 1911;
  console.log(customDate);
  const formattedDate = value.format(`民國${customDate}-MM月-DD號`);
  console.log(formattedDate); // 輸出
  
  return (

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label={'birthday'}
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format={`民國${customDate}-MM月-DD號`}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}