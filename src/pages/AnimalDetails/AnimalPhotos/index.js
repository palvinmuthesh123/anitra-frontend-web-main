import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const AnimalPhoto = (props) => {
  const { title, image } = props;
  return (
    <>
      <Grid container mt={2}>
        <Grid
          item
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
          gap={"16px"}
        >
          <Box border={"2px solid #B1040E"} borderRadius={"20px"}>
            <Box margin={"5px"}>
              <img
                src={image ? image : require("../../../assets/farmer.png")}
                style={styles.animalImage}
              />
            </Box>
          </Box>
          <Box>
            <Typography
              fontFamily={"Poppins-Bold"}
              fontSize={13}
              color={"#B1040E"}
            >
              {title}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

const AnimalPhotos = (props) => {
  const { currentState = {} } = props;

  const { images = {} } = currentState || {};

  return (
    <>
      <Grid
        container
        alignItems={"center"}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item>
          <AnimalPhoto title={"Front Image"} image={images?.front_image} />
        </Grid>
        <Grid item>
          <AnimalPhoto
            title={"Back Image"}
            // image={require("../../../assets/farmer.png")}
            image={images?.back_image}
          />
        </Grid>
        <Grid item>
          <AnimalPhoto title={"Left Image"} image={images?.left_image} />
        </Grid>
        <Grid item>
          <AnimalPhoto title={"Right Image"} image={images?.right_image} />
        </Grid>
        <Grid item>
          <AnimalPhoto title={"Teats Image"} image={images?.teats_image} />
        </Grid>
      </Grid>
    </>
  );
};
export default AnimalPhotos;
const styles = {
  animalImage: {
    width: 150,
    height: 150,
    objectFit: "cover",
  },
};
