import React from "react";
import { useList } from "@refinedev/core";
import { Box, Typography, Stack } from "@mui/material";

import {
  PieChart,
  PropertyReferrals,
  TotalRevenue,
  PropertyCard,
} from "components";

const Home = () => {
  const { data, isLoading, isError } = useList({
    resource: "properties",
    pagination: {
      pageSize: 5,
    },
  });

  const latestProperties = data?.data ?? [];

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Something went wrong!!</div>
  
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        Dashboard
      </Typography>

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <PieChart
          title="Properties for Sale"
          value={684}
          series={[75, 25]}
          colors={["#0000ff", "#b3b3ff"]}
        />
        <PieChart
          title="Properties for Rale"
          value={550}
          series={[60, 40]}
          colors={["#ff8c1a", "#ffd9b3"]}
        />
        <PieChart
          title="Total Customers"
          value={5647}
          series={[65, 35]}
          colors={["#4ce600", "#b3ffb3"]}
        />
        <PieChart
          title="Properties for Cities"
          value={554}
          series={[70, 30]}
          colors={["#ff33cc", "#ffb3ec"]}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <TotalRevenue />
        <PropertyReferrals />
      </Stack>

      <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#fcfcfc"
        display="flex"
        flexDirection="column"
        minWidth="100%"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          Latest Properties
        </Typography>

        <Box mt={2.5} sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {latestProperties.map((property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              title={property.title}
              location={property.location}
              price={property.price}
              photo={property.photo}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
