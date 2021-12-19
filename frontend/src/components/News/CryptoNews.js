import { useState, useEffect } from "react";
import {
  Typography,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Divider,
  Pagination,
} from "@mui/material";
import { removeHtmlTags } from "../../utils";
import { getCryptoNews } from "../../api";
import useDocumentTitle from "../../shared/useDocumentTitle";
//import "./News.css";

const News = () => {
  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [newsData, setNewsData] = useState([]);

  useDocumentTitle("News - CryptoTracker");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let perPage = 20;
        let data = await getCryptoNews(pageNum, perPage);
        data = data.articles;
        setNewsData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageNum]);

  return (
    <>
      {loading && (
        <>
          <LinearProgress
            sx={{
              position: "sticky",
              top: 0,
              height: 8,
              backgroundColor: "loadingBar.color",
            }}
          />
        </>
      )}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          spacing={1}
          padding={1}
        >
          {newsData.map((news, index) => {
            let author = news.author ? "By: " + news.author : "";
            return (
              <Grid key={index} item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Card style={{ height: "100%" }}>
                  {/* <div ref={lastNewsElementRef} /> */}
                  <div>
                    <CardActionArea
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        src={news.urlToImage}
                        alt={news.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {news.title}
                        </Typography>
                        <Typography variant="body3" color="text.primary">
                          {removeHtmlTags(news.description)}
                        </Typography>
                        <br />
                        <br />
                        <Divider />
                        <Typography variant="body2" color="text.primary">
                          Source: {news.source.name}
                          <br />
                          {author}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    {/* <CardActions style={{ justifyContent: "center" }}>
                          <a href={news.url}>Read more...</a>
                        </CardActions> */}
                  </div>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
      <Pagination
        count={5}
        page={pageNum}
        color="primary"
        size="large"
        variant="outlined"
        hidePrevButton={pageNum === 1}
        hideNextButton={pageNum === 5}
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "10px",
        }}
        onChange={(_, newPage) => {
          setPageNum(newPage);
          window.scrollTo(0, 0);
        }}
      />
    </>
  );
};

export default News;
