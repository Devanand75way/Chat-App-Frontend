import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import PasswordInput from "./PasswordInputs";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/api";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
type FormData = typeof schema.__outputType;
const Login = () => {
  const navigate = useNavigate();
  const [userLogin] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data : FormData) => {
    const response = await userLogin(data).unwrap();
    console.log(response);
    if (response) {
      navigate("/");
    } else {
      alert("Something went wrong. Please try again.");
    }
  };
  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Section - Login Form */}
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          backgroundColor: "#fff",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Welcome Back!
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <PasswordInput
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isValid || isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2, textTransform: "none" }}
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Grid>

      {/* Right Section - Image + Welcome Text */}
      <Grid
        item
        xs={12}
        md={8}
        sx={{
          backgroundImage: "url('/103.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          padding: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            bgcolor: "rgba(0,0,0,0.5)",
            p: 2,
            borderRadius: 2,
          }}
        >
          Welcome to Group chat App
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Login;
