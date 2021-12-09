import { useEffect, useState } from "react";
import { getMarketNews } from "../../api";
import {
  ToggleButton,
  LinearProgress,
  List,
  ListItem,
  Typography,
  ToggleButtonGroup,
} from "@mui/material";

// TODO: pagination
const News = () => {
  const [news, setNews] = useState(null);
  const [filter, setFilter] = useState("hot");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getNews = async () => {
      let data;
      try {
        setLoading(true);
        data = await getMarketNews(filter);
        console.log(data.results);
        if (data?.results?.length) {
          setNews(data.results);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, [filter]);

  return (
    <>
      {loading && (
        <LinearProgress
          color="secondary"
          style={{ position: "sticky", top: 0, height: 8 }}
        />
      )}
      <div
        className="flex-center"
        style={{
          flexDirection: "column",
        }}
      >
        <div style={{ margin: "10px" }}>
          <Typography
            color="primary"
            variant="h1"
            style={{ textAlign: "center", fontSize: "2rem" }}
          >
            Market News
          </Typography>
          <ToggleButtonGroup
            color="primary"
            size="large"
            value={filter}
            exclusive
            onChange={(_, newFilter) => {
              if (newFilter) {
                setFilter(newFilter);
              }
            }}
          >
            <ToggleButton value="hot">Hot</ToggleButton>
            <ToggleButton value="rising">Rising</ToggleButton>
            <ToggleButton value="bullish">Bullish</ToggleButton>
            <ToggleButton variant="contained" value="bearish">
              Bearish
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {news !== null && (
          <List>
            {news.map((item) => {
              return (
                <ListItem key={item.id}>
                  <Typography color="white">{item.title}</Typography>
                </ListItem>
              );
            })}
          </List>
        )}
      </div>
    </>
  );
};

export default News;
