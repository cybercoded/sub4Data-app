import React from "react";

export const Context = React.createContext();

export const reducer = (state, value) => {
    return {
      ...state,
      ...value
    };
};

export const initialValues = {
    loader: {
      visible: false,
      icon: "loader", //'highlight-off' 'check-circle-outline',
      text: "Please wait",
      actions: false,
      color: '#0CC',
    }
};