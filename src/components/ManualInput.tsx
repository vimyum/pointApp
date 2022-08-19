import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import { Link, useNavigate } from "react-router-dom";

interface ManualInputProps {
  setCode: any;
  setExit: any;
  pay?: boolean;
}

const ManualInput: React.FC<ManualInputProps> = ({setCode, setExit, pay = false}: ManualInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const typeOfCodeStr = pay ? '支払い先コード' : 'ポイント受け取りコード';
  return (<Box sx={{flexDirection: 'column', textAlign: 'center', justifyContent: 'center', display: 'flex', py: 8, px: 5}}>
    <Box>
      <Typography component="div" variant="h6" sx={{my:2}}>
        {typeOfCodeStr}
      </Typography>
    </Box>
    <Box>
         <TextField
          error={false}
          helperText=""
          variant="outlined"
          fullWidth={true}
          value={inputValue}
          onChange={handleChange}
        />
    </Box>
    <Box sx={{pt: 15}}>
       <Button variant="outlined" onClick={()=> setExit(false)} fullWidth >QRコードを読み取る</Button>
    </Box>
    <Box sx={{pt: 2}}>
       <Button variant="contained" onClick={()=> setCode(inputValue)} fullWidth >コードを確定</Button>
    </Box>
    </Box>);
}

export default ManualInput;