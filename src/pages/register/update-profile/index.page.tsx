import React from 'react'
import { Button, Heading, MultiStep, Text, TextArea } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Header } from '../styles'
import { FromAnnotations, ProfileBox } from './style'
import { useSession } from 'next-auth/react'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,

    formState: {  isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema)
  })


  const session = useSession()

  console.log(session);
  


  const handleUpdateProfile = async (data: UpdateProfileData) => {

  }

  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Bem-vindo ao Ignite Call!</Heading>

        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as={'form'} onSubmit={handleSubmit(handleUpdateProfile)}>
        <label htmlFor="">
          <Text size={'sm'}>Foto de perfil</Text>
        </label>


        <label>
          <Text size={'sm'}>Sobre voce</Text>
          <TextArea {...register('bio')} />
          <FromAnnotations size={'sm'}>
            Fale um pouco sobre voce. Isto sera exibido em sua pagina pessoal
          </FromAnnotations>
        </label>
     
        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}
