import { Stack } from 'expo-router'
import React from 'react'

const makePaymentLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{headerShown: false}} />
        </Stack>
    )
}

export default makePaymentLayout