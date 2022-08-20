import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { Link, useNavigate } from "react-router-dom";

interface ConfirmCardProps {
  callback: any;
  cardPicture: string;
  point: number;
  comment: string;
  used: boolean;
}

const TicketCard: React.FC<ConfirmCardProps> = (props) => {
  const {callback, cardPicture, point, comment, used} = props;
  const navigate = useNavigate();

  return (<Box sx={{textAlign: 'center', justifyContent: 'center', display: 'flex'}}>
      <Card sx={{ maxWidth: 345, my: 5 }}>
      <CardMedia
        component="img"
        alt="cardPicture"
        height="140"
        image={cardPicture}
      />
      <CardContent>
        <Typography gutterBottom variant="h3" component="span" sx={{display: 'inline-block', mx: 2}}>
          {point.toLocaleString()}
        </Typography>
        <Typography gutterBottom component="span" sx={{fontSize: '0.7em'}}>
           ポイント
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {comment}
        </Typography>
      </CardContent>
      <CardActions sx={{display: 'flex', justifyContent: 'space-around'}}>
        <Box sx={{flexGrow: "1"}} >
          <Button onClick={callback} size="small" variant="contained" sx={{width: '80%'}}
          disabled={used} >{used ? "受取り済み" : "受け取る"}</Button>
        </Box>
        <Box>
        <Button size="small" variant="outlined" sx={{width: '100%'}}
         component={Link} to="/" >キャンセル</Button>
        </Box>
      </CardActions>
    </Card>
    </Box>);
}

export default TicketCard;