import React from 'react'
import { Box, Grid, Typography, TableRow,TableCell } from '@mui/material';

const MuzzlePhoto = (props) => {
  const { title, image } = props;
  return (
    <>

      <Grid container mt={2}>
        <Grid item alignItems={"center"} display={"flex"} flexDirection={"column"} gap={"16px"}>
          <Box border={"2px solid #B1040E"} borderRadius={"20px"}>
            <Box margin={"5px"}>
              <img src={image} style={styles.muzzleImage} />
            </Box>
          </Box>
          <Box>
            <Typography fontFamily={'Poppins-Bold'} fontSize={13} color={"#B1040E"}>{title}</Typography>
          </Box>
        </Grid>
      </Grid>

    </>
  )
}

const MuzzlePhotos = (props) => {
  const { animalId, currentState = {} } = props;



  return (
    <>
      <Grid
        container
        alignItems={"center"}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item>
          <MuzzlePhoto title={"Front Image"} image={currentState?.images?.back_images} />
        </Grid>
        <Grid item>
          <MuzzlePhoto title={"Back Image"} image={require('../../../assets/farmer.png')} />
        </Grid>
        <Grid item>
          <MuzzlePhoto title={"Left Image"} image={require('../../../assets/farmer.png')} />
        </Grid>
        <Grid item>
          <MuzzlePhoto title={"Right Image"} image={require('../../../assets/farmer.png')} />
        </Grid>
        <Grid item>
          <MuzzlePhoto title={"Teat Image"} image={require('../../../assets/farmer.png')} />
        </Grid>
      </Grid>
    </>
  )
}
export default MuzzlePhotos;
const styles = {
  muzzleImage: {
    width: 150,
    height: 150,

  }
}