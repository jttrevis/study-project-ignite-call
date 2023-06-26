import { Heading, Text } from "@ignite-ui/react";
import { Container, Hero, Preview } from "./styles";

import previewImage from '@/assets/image 1.png'
import Image from "next/image";
export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as='h1' size='4xl'>Agendamendo descomplicado</Heading>
        <Text size='xl'>Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.</Text>
      </Hero>

      <Preview>
        <Image priority quality={100}  height={400} alt="calendario simbolizando aplicacao" src={previewImage} />
      </Preview>
    </Container>
  );
}
