import React from "react";
import { useOne, useGetIdentity } from "@refinedev/core";

import { Profile } from "components";

const MyProfile = () => {
  const { data: user } = useGetIdentity<{
    userid: string;
  }>();

  const { data, isLoading, isError } = useOne({
    resource: "users",
    id: user?.userid
  })

  console.log(data);
  

  const myProfile = data?.data ?? [];

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>

  return (
    <Profile
      type="My"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allProperties}
    />
  );
};

export default MyProfile;
