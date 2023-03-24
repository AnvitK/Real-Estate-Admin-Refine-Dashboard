import React from "react";
import { TitleProps, useLink } from "@refinedev/core";
import { Button } from "@mui/material";

import { reLogo, realEstateLogo } from "assets";

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    const Link = useLink();

    return (
        <Button fullWidth variant="text" disableRipple>
            <Link to="/">
                {collapsed ? (
                    <img src={reLogo} alt="Real Estate" width="28px" />
                ) : (
                    <img src={realEstateLogo} alt="Real Estate" width="140px" />
                )}
            </Link>
        </Button>
    );
};