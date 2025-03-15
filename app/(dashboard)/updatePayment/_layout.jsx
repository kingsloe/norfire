import { Stack } from 'expo-router'
import React from 'react'

const UpdatePaymentLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{headerShown: true, headerTitle: 'Update Payment', headerTitleAlign: 'center'}} />
    </Stack>
  )
}

export default UpdatePaymentLayout