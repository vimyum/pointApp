import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

import { UserInfo } from "../schemas/schema";

const buttonSx = {
  width: '80%',
  fontSize: '1.2em'
}

const boxSx = {
 display: 'flex',
 justifyContent: 'center',
 my: 2,
};

const HelpView: React.FC = () => {
  return (<div>
   <Container maxWidth="xs" sx={{mt: 5, mb: 1}}>
    <Typography component="h5" variant="h5" sx={{textAlign: 'center'}}>
      プライバシーポリシー
    </Typography>
    </Container>
  </div>)
}

export default HelpView;