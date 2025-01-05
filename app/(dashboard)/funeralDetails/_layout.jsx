import { Stack } from 'expo-router'
import React from 'react'

const funeralDetailsLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="[id]" options={{headerShown: false, headerTitle: 'Funeral Details'}} />
			<Stack.Screen name="membersToMakePayment" options={{headerShown: true, headerTitle: 'Family Members'}}/>
			<Stack.Screen name="makePayment" options={{headerShown: true, headerTitle: 'Record Payment'}} />
		</Stack>
	)
}

export default funeralDetailsLayout