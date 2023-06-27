import React, { useEffect } from 'react'
import { Container, Form, FormError, Header } from './styles'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: 'O Usuario precisa ter no minimo 3 caracteres',
    })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuario pode ter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),

  name: z.string().min(3, {
    message: 'O nome precisa ter no minimo 3 caracteres',
  }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: 'username',
    },
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await api.post('/users', {
        username: data.username,
        name: data.name,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        alert(error.response.data.message)
        return
      }
      console.error(error)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Bem-vindo ao Ignite Call!</Heading>

        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as={'form'} onSubmit={handleSubmit(handleRegister)}>
        <label htmlFor="">
          <Text>Nome do usario</Text>
          <TextInput
            {...register('username')}
            prefix="ignite.com/"
            placeholder="seu-usuario"
          />
        </label>
        {errors.username && (
          <FormError size={'sm'}>{errors.username.message}</FormError>
        )}

        <label>
          <Text>Nome completo</Text>
          <TextInput {...register('name')} placeholder="seu-nome" />
        </label>
        {errors.name && (
          <FormError size={'sm'}>{errors.name.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Proximo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
