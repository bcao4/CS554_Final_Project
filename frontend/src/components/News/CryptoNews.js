import { useState, useEffect, useRef, useCallback } from "react";
import {
  Typography,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Divider,
  Pagination
} from "@mui/material";
import { removeHtmlTags } from "../../utils";
import { getCryptoNews } from "../../api";
import "./News.css";

const News = () => {
  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [newsData, setNewsData] = useState([]);

  // const observer = useRef();
  // const lastNewsElementRef = useCallback(
  //   (node) => {
  //     if (loading) return;
  //     if (observer.current) {
  //       observer.current.disconnect();
  //     }
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting) {
  //         //console.log("visible" && nextPageStatus);
  //         setPageNum((prevPageNum) => prevPageNum + 1);
  //       }
  //     });
  //     if (node) {
  //       observer.current.observe(node);
  //     }
  //     //console.log(node);
  //   },
  //   [loading]
  // );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let perPage = 20; 
        let data;
        try {
          data = await getCryptoNews(pageNum, perPage);
          data = data.articles;
          console.log(data)
        } catch (e) {
          console.error(e);
          return;
        }
        //setNewsData((prevNews) => [...prevNews, ...data]);
        setNewsData(data);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [pageNum]);
  console.log(newsData)
  
  return (
    <>
      {loading && (
        <>
          <LinearProgress
            color="secondary"
            style={{ position: "sticky", top: 0, height: 8 }}
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
          {newsData
            .map((news, index) => {
              return (
                <Grid key={index} item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Card>
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
                            <Typography variant="body3" color="text.secondary">
                              {removeHtmlTags(news.description)}
                            </Typography>
                            <br/>
                            <br/>
                            <Divider />
                            <Typography variant="body2" color="text.secondary">
                              By: {news.author}
                              <br/>
                              Source: {news.source.name}
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
      <div>
        <Pagination
          className="pagination-button"
          count={5}
          page={pageNum}
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "10px",
          }}
          size="large"
          onChange={(_, newPage) => {
            setPageNum(newPage);
            window.scrollTo(0,0);
          }}
        />
        </div>
    </>
  );
};

export default News;