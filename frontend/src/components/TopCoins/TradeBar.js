import { Drawer, IconButton, Divider, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useContext } from "react";
import { capitalize } from "../../utils";
import { AuthContext } from "../../firebase/Auth";
import { Link } from "react-router-dom";

const TradeBar = (props) => {
  const { coin } = props;

  const [tradeBarOpen, setTradeBarOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <Button
        variant="contained"
        style={{ position: "fixed", right: 10, top: 10, zIndex: 2 }}
        onClick={() => setTradeBarOpen(true)}
        size="large"
      >
        Trade
      </Button>
      <Drawer
        sx={{
          width: 400,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 400,
            boxSizing: "border-box",
            backgroundColor: "black",
          },
        }}
        variant="persistent"
        anchor="right"
        open={tradeBarOpen}
      >
        <IconButton
          size="large"
          onClick={() => setTradeBarOpen(false)}
          style={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
        <Divider style={{ backgroundColor: "white" }} />
        {!currentUser ? (
          <>
            <Typography
              style={{ color: "white", textAlign: "center", marginTop: 10 }}
            >
              Please sign in to trade {capitalize(coin)}!
            </Typography>
            <div className="flex-center" style={{ marginTop: 10 }}>
              <Button
                variant="contained"
                component={Link}
                to="/login"
                style={{ marginRight: 6 }}
              >
                Sign In
              </Button>
              <Button variant="contained" component={Link} to="/signup">
                Sign Up
              </Button>
            </div>
          </>
        ) : (
          <Typography
            style={{ color: "white", textAlign: "center", marginTop: 10 }}
          >
            Trade
          </Typography>
        )}
      </Drawer>
    </>
  );
};

export default TradeBar;
