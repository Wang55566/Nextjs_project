import React from 'react'
import { Html, Body, Container, Text, Link, Preview } from '@react-email/components'

const WelcomeTemplate = ({ name }: { name: string }) => {
  return (
    <Html>
      <Preview>Welcome</Preview>
      <Body>
        <Container>
          <Text>Hello World {name}</Text>
          <Link href='https://www.google.com'>www.google.com</Link>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeTemplate
