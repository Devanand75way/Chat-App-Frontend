import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { ComponentProps, forwardRef } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = ComponentProps<typeof TextField>;

const PasswordInput = forwardRef((props: Props, ref: Props["ref"]) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <TextField
        ref={ref}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
        type={showPassword ? "text" : "password"}
      />
    </>
  );
});

export default PasswordInput;
