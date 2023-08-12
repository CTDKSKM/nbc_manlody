import React from "react";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
    ${reset}
    *{
        margin: 0 auto;
    }
    
    @import url("https://fonts.googleapis.com/css2?family=Libre+Franklin&display=swap");
    html,body{
        font-family: "Libre Franklin", sans-serif;
    }

    button{
        border:none;
        background-color:transparent;
        &:hover {
            // background-color: rgba(128, 128, 128, 0.1);
            color: rgba(128, 128, 128, 0.6);
        }
    }
    input{
        border: none;
    }
`;
export default GlobalStyle;
