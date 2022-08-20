import React, { useRef, useState, useEffect, createContext } from "react";
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';

import { getDatabase, ref, get, child } from "firebase/database";

type Schedule = {
  title: string;
  date: string;
  detail: string;
  capacity: string;
  price: string;
}

const cards = (schedule: Record<string, Schedule>) => {
  return Object.values(schedule).map( (event) => {
    return (<Card variant="outlined" sx={{my: 2}}>
    <CardContent>
      <CardHeader  title={`${event.date} ${event.title}`} titleTypographyProps={{ variant: "h6" }} />
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        参加費: {event.price}
      </Typography>
      <Typography variant="body2">
        {event.detail}
      </Typography>
    </CardContent>
  </Card>);
});
}

const ScheduleView: React.FC = () => {
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `schedule/`)).then((snapshot) => {
      const data = snapshot.val();
      setSchedule(snapshot.val());
    });
  }, []);

  return (<div>
   <Container maxWidth="xs" sx={{mt: 5, mb: 1, fontSize: "small"}}>
    <Typography component="h5" variant="h5" sx={{textAlign: 'center', my: 3}}>
      今後のイベント予定
    </Typography>
    { cards(schedule) }
    </Container>
  </div>);
}

export default ScheduleView;