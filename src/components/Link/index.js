import React from 'react';
import { Link } from 'react-router-dom';

const CustomLink = (props) => {
    <Link style={{
        textDecoration: "none"
    }}
    to={props.screenName}
    >
        {props.children}
    </Link>
}

export default CustomLink;