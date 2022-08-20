import { useRef, useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserWithEmailAndPassword } from "firebase/auth";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import TextField from "@mui/material/TextField";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { UserDbInfo } from "../schemas/schema";
import { auth } from "../App";

const buttonSx = {
  width: "80%",
  fontSize: "1.2em",
  mt: 2,
};

// バリデーションルール
const schema = yup.object({
  email: yup
    .string()
    .required("必須です")
    .email("メールアドレスが正しくありません"),
  name: yup.string().required("必須です"),
  password: yup
    .string()
    .required("必須です")
    .min(6, "6文字以上必要です")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].*$/,
      "パスワードが弱いです"
    ),
  tally: yup
    .string()
    .required("必須です")
    .matches(/^つちざわ|tsuchizawa$/, "正しくありません"),
});

interface FormInput {
  name: string;
  email: string;
  password: string;
  tally: string;
}

const RegisterView: React.FC<{
  handleCancel: any;
  writeUserData: (userDbInfo: UserDbInfo) => void;
}> = (props) => {
  const { handleCancel, writeUserData } = props;
  const [agreed, setAgreed] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const onRegister: SubmitHandler<FormInput> = (data: FormInput) => {
    console.log(`submit: %o`, data);
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        console.log("ユーザー作成完了");
        writeUserData({
          userId: userCredential.user.uid,
          name: data.name,
          email: data.email,
          balance: 300,
          role: "user",
        });
      })
      .catch((error) => {
        console.log("ユーザー作成失敗", error);
      });
  };
  return (
    <div>
      <Container maxWidth="xs" sx={{ mt: 5, mb: 1 }}>
        <Typography component="h5" variant="h5" sx={{ textAlign: "center" }}>
          会員情報を登録
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <AccountCircle sx={{ fontSize: 86 }} color="primary" />
        </Box>
        <Box sx={{ textAlign: "center", px: 5, mt: 3 }}>
          <TextField
            required
            size="small"
            id="outlined-required"
            label="お名前"
            fullWidth={true}
            sx={{ my: 1 }}
            {...register("name")}
            error={"name" in errors}
            helperText={errors.name?.message}
          />
          <TextField
            required
            size="small"
            id="outlined-required"
            label="メールアドレス"
            fullWidth={true}
            sx={{ my: 1 }}
            {...register("email")}
            error={"email" in errors}
            helperText={errors.email?.message}
          />
          <TextField
            required
            size="small"
            id="outlined-required"
            label="パスワード"
            fullWidth={true}
            sx={{ my: 1 }}
            {...register("password")}
            error={"password" in errors}
            helperText={errors.password?.message}
          />
          <TextField
            required
            size="small"
            id="outlined-required"
            label="合言葉"
            fullWidth={true}
            sx={{ my: 1 }}
            {...register("tally")}
            error={"tally" in errors}
            helperText="合言葉は現地スタッフに確認してください"
          />

          <FormControlLabel
            control={<Checkbox 
            checked={agreed}
            onChange={(ev)=> {setAgreed(ev.target.checked)}}
            />}
            label={
              <Typography sx={{ fontSize: "0.8em" }}>
                <a href="example.com">プライバシーポリシー</a>に同意します
              </Typography>
            }
          />

          <Button
            variant="contained"
            color="primary"
            sx={buttonSx}
            size="small"
            onClick={handleSubmit(onRegister)}
            disabled={!agreed}
          >
            登録する
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={buttonSx}
            size="small"
            onClick={handleCancel}
          >
            キャンセル
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default RegisterView;
