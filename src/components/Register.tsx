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
import React from "react";
import PasswordInput from "./PasswordInputs";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../services/api";

type FormData = typeof schema.__outputType;

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerUser] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (value: FormData) => {
    console.log(value)
    try {
      const data = await registerUser(value);
      console.log(data);
    } catch (error) {
      const validatonError = error;
      console.error(validatonError);
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Section - Registration Form */}
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
          Create Your Account
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          {/* Name Field */}
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* Email Field */}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Phone Number Field */}
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          {/* Password Field with Show/Hide Icon */}
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
            sx={{ mt: 2 }}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Register"
            )}
          </Button>
          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2, textTransform: "none" }}
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
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
          Join Our Community!
        </Typography>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
