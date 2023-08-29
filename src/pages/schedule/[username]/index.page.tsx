import React from "react";
import { UserHeader, Container } from "./styles";
import { Avatar, Heading, Text } from "@ignite-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "@/lib/prisma";

interface ScheduleProps {
  user : {
    name: string;
    bio: string;
    avatarUrl: string;
  }
}

export default function Schedule({user} : ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths =async (params) => {
  return {
    paths: [],
    fallback: 'blocking'
  }  
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: user.name, 
      bio: user.bio, 
      avatarUrl: user.avatarUrl
    },

    revalidate: 60 * 60 * 24,
  };
};
