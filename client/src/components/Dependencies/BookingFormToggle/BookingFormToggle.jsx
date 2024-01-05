import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from 'react';

export default function BookingFormToggle({setOption}) {
  const [alignment, setAlignment] = useState('Book');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    setOption(event.target.value)
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value='Reserve'>Reserve</ToggleButton>
      <ToggleButton value="Book">Book</ToggleButton>
    </ToggleButtonGroup>
  );
}