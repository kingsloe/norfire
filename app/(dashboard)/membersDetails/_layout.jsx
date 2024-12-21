import { Stack } from 'expo-router'
import React from 'react'

const membersDetailsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{headerShown: false}} />
    </Stack>
  )
}

export default membersDetailsLayout