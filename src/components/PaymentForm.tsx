import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { UserDbInfo } from '../schemas/schema';

import { Link, useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';

interface PaymentFormProps {
  callback: any;
  userInfo: UserDbInfo;
  payeeInfo: UserDbInfo;
}

const buttonSx = {
  width: '80%',
  fontSize: '1.2em',
  mt: 3,
}


const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const {callback, payeeInfo, userInfo} = props;
  const [inputValue, setInputValue] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
      <Box sx={{flexDirection: 'column', textAlign: 'center', justifyContent: 'space-between',
       alignContent: 'space-around', display: 'flex', py: 8, px: 5}}>

      <Typography component="div" variant="h6" sx={{mb:1}}>
        支払い先：{payeeInfo.name} 
      </Typography>
    <Box sx={{mb: 8}}>
         <TextField
          label="利用ポイント額"
          error={parseInt(inputValue) > userInfo.balance}
          helperText="ポイント残高が足りません"
          value={inputValue}
          variant="outlined"
          fullWidth={true}
          type="number"
          onChange={handleChange}
        />
    </Box>
    <Box>
      <Button onClick={() => { callback(inputValue) }} size="small" variant="contained"
       sx={buttonSx} disabled={parseInt(inputValue) > userInfo.balance}>
        利用する
      </Button>
        </Box>
        <Box>
        <Button size="small" variant="outlined" sx={buttonSx}
         component={Link} to="/" >キャンセル</Button>
        </Box>
    </Box>);
}

export default PaymentForm;