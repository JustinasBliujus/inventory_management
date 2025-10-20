import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleButton = ({
  text,
  useOneTap,
  type,
  size,
  locale,
  theme,
  width,
  onSuccess,
  onError,
}) => {
  return (
    <div style={{ colorScheme: "light" }}>
      <GoogleLogin
        text={text}
        useOneTap={useOneTap}
        type={type}
        size={size}
        locale={locale}
        theme={theme}
        width={width}
        logo_alignment="left"
        auto_select={false}
        onSuccess={onSuccess || ((res) => console.log(res))}
        onError={onError || (() => console.log("Login failed"))}
      />
    </div>
  );
};

export default GoogleButton;
