import { useRef, useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { createUserWithEmailAndPassword } from 'firebase/auth'

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

import { UserDbInfo } from "../schemas/schema";
import {auth} from "../App"
import {signInWithEmailAndPassword} from "firebase/auth";

const buttonSx = {
  width: '80%',
  fontSize: '1.2em',
  mt: 3,
}

// バリデーションルール
const schema = yup.object({
  email: yup
    .string()
    .required('必須です')
    .email('メールアドレスが正しくありません'),
  password: yup
    .string()
    .required('必須です') ,
})

interface FormInput {
  email: string
  password: string
}

const onLogin: SubmitHandler<FormInput> = async (data: FormInput) => {
  try {
    await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );
  } catch(error) {
    alert("メールアドレスまたはパスワードが間違っています");
  }
}

const LoginView: React.FC<{handleCancel: any}> = (props) => {
  const {handleCancel} = props;

  const [name, setName] = useState<string>("");
  const [email, setPhone] = useState<string>("");
  const [counterSign, setCounterSign] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors }  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  return (<div>
   <Container maxWidth="xs" sx={{mt: 5, mb: 1}}>
    <Typography component="h5" variant="h5" sx={{textAlign: 'center'}}>
      サインイン
    </Typography>
    <Box sx={{textAlign: 'center'}} >
    <AccountCircle sx={{fontSize: 86}} color="primary" />
</Box>
    <Box sx={{textAlign: 'center', px: 5, mt: 3}} >
<TextField
          required
          id="outlined-required"
          label="メールアドレス"
          fullWidth={true}
          sx={{my: 1}}
          {...register('email')}
          error={'email' in errors}
          helperText={errors.email?.message}
        />

<TextField
          required
          id="outlined-required"
          label="パスワード"
          fullWidth={true}
          sx={{my: 1}}
          {...register('password')}
          error={'password' in errors}
          helperText={errors.password?.message}
          type="password"
        />

    <Button variant="contained" color="primary" sx={buttonSx} 
              onClick={handleSubmit(onLogin)}
    >
      ログイン
    </Button>
    <Button variant="outlined" color="primary" sx={buttonSx} 
              onClick={handleCancel}
    >
      キャンセル
    </Button>

</Box>
    </Container>
  </div>)
}

export default LoginView