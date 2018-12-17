import * as React from "react";

interface IButtonProps {
  onClick: () => void;
}

export const Button: React.SFC<IButtonProps> = props => {
  return (
    //Temporary as emotion css doesn't work well with CRA
    <button
      style={{
        width: "240px",
        borderRadius: "5px",
        fontFamily: "Open Sans",
        fontSize: "16px",
        color: "white",
        backgroundColor: "hsl(217, 94%, 31%)",
        boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
        padding: "4px"
      }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
