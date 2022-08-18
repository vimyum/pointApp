import { useRef, useState, useCallback } from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ForestIcon from '@mui/icons-material/Forest';
import {QRCodeSVG} from 'qrcode.react';

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

// import { UserInfo } from "../schemas/schema";
import { User } from 'firebase/auth'

const buttonSx = {
  width: '80%',
  fontSize: '1.2em'
}

const boxSx = {
 display: 'flex',
 justifyContent: 'center',
 my: 2,
};

type Props = {
  userInfo: User;
};

const TopView: React.FC<Props> = (props) => {
  const {userInfo} = props;
  return (<div>
   <Container maxWidth="xs" sx={{mt: 5, mb: 1}}>
    <Typography component="div" variant="h6">
      あなたの保有ポイント
    </Typography>
    <Box sx={{textAlign: 'center'}}>
    <ForestIcon sx={{ fontSize: 42 }} color="primary" />
    <Typography component="span" variant="h2" sx={{...boxSx, mb: 5, ml:1, display: 'inline-block', mr: 2}}>
      {/* userInfo.point.toLocaleString() */ "3000" }
    </Typography>
    <Typography gutterBottom component="span" sx={{fontSize: '0.9em'}}>
           ポイント
    </Typography>
</Box>
<Box sx={boxSx}>
    <Button variant="outlined" color="primary" component={Link} to="/pay" sx={buttonSx} >
      ポイントを利用する
    </Button>
</Box>
<Box sx={boxSx}>
    <Button variant="outlined" color="primary" component={Link} to="/receive" sx={buttonSx}>
      ポイントを受け取る
    </Button>
</Box>
<Box sx={{...boxSx, mt: 5}}>
  <QRCodeSVG value='1234567890' fgColor='#409488' />,
</Box>
    </Container>
  </div>)
}

export default TopView;
