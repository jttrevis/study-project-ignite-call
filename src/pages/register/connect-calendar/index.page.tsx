import React from 'react'
import { Container, Header } from '../styles'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { useRouter } from 'next/router'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'

export default function Register() {
  const router = useRouter()
  const session = useSession()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  const handleConnectToCalendar = async () => {
    await signIn('google')
  }

  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Conecte sua agenda!</Heading>

        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google calendar</Text>
          {isSignedIn ? (
            <Button disabled>
              Conectado
              <Check size={'small'} />
            </Button>
          ) : (
            <Button
              onClick={handleConnectToCalendar}
              size={'sm'}
              variant={'secondary'}
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError size={'sm'}>
            Falha ao se conectar ao Google, verifique se voce habilitou as
            permissoes de acesso ao Google Calendar.
          </AuthError>
        )}

        <Button disabled={!isSignedIn} type="submit">
          Proximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
